from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .functions import ask_mistral

class PromptAPI(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data.get('data', None)
        if data:
            result, retrieved_chunks = ask_mistral(data)
            
            response = {}
            response['response'] = result
            response['detail'] = retrieved_chunks
            
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response({'pas de résultat'}, status=status.HTTP_200_OK)





