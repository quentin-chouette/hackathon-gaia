from mistralai.client import MistralClient, ChatMessage
import numpy as np
import faiss
import json
import re

# API KEY
api_key = "Yb2kAF0DR4Mva5AEmoYFV3kYRAKdXB7i"
client = MistralClient(api_key=api_key)


def depth_search(x):
    if type(x) is dict:
        if "articles" in list(x.keys()) and len(x["articles"]) > 0:
            return sum((depth_search(y) for y in x["articles"]), [])
        if "sections" in list(x.keys()) and len(x["sections"]) > 0:
            return sum((depth_search(y) for y in x["sections"]), [])
        elif "content" in list(x.keys()):
            content = x["content"]
            cid = x["cid"]
            url = "https://www.legifrance.gouv.fr/codes/article_lc/" + x["cid"]
            paths = x["pathTitle"]
            title = "\n".join([path for path in paths])
            content = content.replace("<p>", "")
            content = content.replace("</p>", "")
            text = f"""
            {title}
            {content}
            """
            return [
                {
                    "prompt": text,
                    "cid": cid,
                    "url": url,
                    "paths": paths,
                    "content": content,
                }
            ]
    return []


def get_text_embedding(input):
    embeddings_batch_response = client.embeddings(model="mistral-embed", input=input)
    return embeddings_batch_response.data[0].embedding


def run_mistral(user_message, model="mistral-large-latest"):
    messages = [ChatMessage(role="user", content=user_message)]
    chat_response = client.chat(
        model=model,
        messages=messages,
    )
    return chat_response.choices[0].message.content


def ask_mistral(input):
    question = f"""J'ai une parcelle vierge basée au {input["address"]}, dans le département {input["departement"]}.
    Elle fait {input["size"]} hectare.
    Ma parcelle a une pente de {input["inclinaison"]}%.
    Ma parcelle est de type {input["zone_type"]}.
    {"Cette parcelle comporte des haies" if input["haie"] else "Cette parcelle ne comporte pas de haies."}
    {"Cette parcelle comporte des arbres" if input["arbre"] else "Cette parcelle ne comporte pas de arbres."}
    {"Cette parcelle comporte des cours d'eau" if input["riviere"] else "Cette parcelle ne comporte pas de cours d'eau."}
    J'y faisais pousser de la {input["old_culture"]} jusqu'au {input["old_date"]}.
    {"Je suis un agriculteur actif indépendant" if input["independant"] else "Je ne suis pas un agriculteur actif indépendant."}
    {"Je suis un agriculteur à temps partiel." if input["temps_partiel"] else "Je suis un agriculteur à temps plein."}
    {"Je bénéficie des aides de la PAC." if input["PAC"] else "Je ne bénéficie pas des aides de la PAC."}
    Je souhaite faire pousser de la {input["culture"]} dur à partir du {input["date"]}.
    {"Je souhaite faire cette culture en vue d'une commercialisation." if input["commercialisation"] else "Je souhaite faire cette culture sans but de commercialisation."}
    {"A quelles aides ai-je droit ?" if input["ask_aides"] else "Quelles sont les contraintes réglementaires ?"}"""
        
    # Load rural code
    with open("gaia/rural_code.json", "rb") as file:
        data = json.load(file)
    chunks1 = depth_search(data)

    # Load rural code embeddings
    text_embeddings1 = np.load("gaia/code_rural.npy")

    # Load arretes et decrets
    with open("gaia/list_arrete_decret_detailed.json", "rb") as file:
        data = json.load(file)
    articles = []
    for arrete in data:
        cid = arrete["cid"]
        title = arrete["title"]
        for i, article in enumerate(arrete["detailed_content_articles"]):
            prompt = f"""{title}
            Article {i+1}
            {article}
            """
            articles.append(
                {
                    "prompt": prompt,
                    "cid": cid,
                    "url": "https://www.legifrance.gouv.fr/jorf/id/" + cid,
                    "paths": [title, f"Article {i+1}"],
                    "content": article,
                }
            )
    chunks2 = articles

    # Load arretes et decrets embeddings
    text_embeddings2 = np.load("gaia/arrete_decret.npy")

    # Merge data
    chunks = chunks1 + chunks2
    text_embeddings = np.vstack([text_embeddings1, text_embeddings2])

    # Save in database
    d = text_embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(text_embeddings)

    # compute embedding of question
    question_embeddings = np.array([get_text_embedding(question)])

    # Retrieve similar chunks from the vector database
    nb_elements_context = 20
    D, indices = index.search(question_embeddings, k=nb_elements_context)
    retrieved_chunks = [chunks[i] for i in indices.tolist()[0]]

    # Generate prompt
    context = "\n---------------------\n".join(
        [f"[{i+1}] : {x}" for (i, x) in enumerate(retrieved_chunks)]
    )
    prompt = f"""
    Voici {nb_elements_context} sources juridiques.
    ---------------------
    {context}
    ---------------------
    Grâce à ces sources juridiques ainsi qu'à tes connaissances, réponds à cette requête.
    Précise sur lequels des {nb_elements_context} sources juridiques tu t'appuies.
    Quand tu cites un élément de contexte, écris juste son unique numéro entre crochets, par exemple comme ça : [5].
    Requête: {question}
    Réponse:
    """

    # run mistral
    content = run_mistral(prompt)

    # Split on references
    content2 = re.sub("\[([0-9]+)\]", "|||TOCONVERT-\\1|||", content)
    content2 = content2.split("|||")
    content3 = []
    ref_nums = []
    for element in content2:
        if re.match(r"TOCONVERT-[0-9]+", element):
            ref = int(element[10:])
            content3.append(ref)
            if ref not in ref_nums:
                ref_nums.append(ref)
        else:
            content3.append(element)

    # Reindex references
    new_ref_dict = {x: ref_nums.index(x) + 1 for x in ref_nums}
    content4 = []
    for element in content3:
        if type(element) is int:
            content4.append(new_ref_dict[element])
        else:
            content4.append(element)
    final_chunks = {}
    for i, chunk in enumerate(retrieved_chunks):
        pre_num = i + 1
        if pre_num in new_ref_dict:
            new_num = new_ref_dict[pre_num]
            final_chunks[new_num] = chunk

    return content4, final_chunks
