import mapboxgl from 'mapbox-gl';
import axios, { AxiosResponse } from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Box, Button, Container, IconButton, Skeleton, ThemeProvider } from '@mui/material';
import { chouetteTheme } from '../themes';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeRef from './CodeRef';
import { PreInfo } from '../App';
import { useNavigate } from 'react-router-dom'

mapboxgl.accessToken = import.meta.env.MAPBOXTOKEN

const API_URL = 'https://api.hackathon.chouette.vision/api/gaia/prompt/';

type ChatProps = {
  preSet: PreInfo
}

type Message = {sender: 'user' | 'ai', message: AiResponse | string};
class AiResponse {
  response: (string | number)[];
  detail: {
    [key:number]:{
      cid?: string;
      url: string;
      paths: string[];
      content:string;
    }
  };
  constructor(json:any) {
    this.response = json.response;
    this.detail = json.detail;
  }
}

function Chat({preSet}: ChatProps) {
  const [response, setRespone] = useState<AiResponse>();
  const [question, setQuestion] = useState(preSet);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [titles, setTitles] = useState(['']);
  const [text, setText] = useState('');

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatHistory?.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory.length]);
  
  useEffect(() => {
    sendPreInfo()
  }, [])

  const handleDialogOpen = (selectTitle:string[],selectText:string)=>{
    setTitles(selectTitle);
    setText(selectText);
    setOpenDetail(true);
  }
  const transformAiMessage = (messageToTrans:AiResponse) => {
  
    return (
      <p>
        {messageToTrans.response.map((m: string | number)=>{
          return (
            typeof m === 'number' 
          ? <span><IconButton color='error' sx={{fontSize:'10px', fontWeight:'700', height: '12px', width:'12px', padding:'1px'}} onClick={()=>handleDialogOpen(messageToTrans.detail[m].paths, messageToTrans.detail[m].content)}>{`[${m}]`}</IconButton></span>
          : <span>{m}</span>)
        })}
      </p>
      )
    
  }
  const postQuestion =async (params:{prompt: string}): Promise<AxiosResponse> => { 
      const response = await axios.post(`${API_URL}`, params);
      return response;
  }
  const handleSubmit = async (e: FormEvent)=> {
    e.preventDefault();
    const q = {data: question}
    console.log(q);
    const userMessage:Message = {sender: 'user', message: question}
    setChatHistory((preHistory)=> (preHistory ? [...preHistory, userMessage] : [userMessage]));
    const r = await postQuestion(q);
    const mistrel = new AiResponse(r.data)
    setRespone(mistrel);
    console.log({mistrel});
    const aiMessage: Message = {sender:'ai', message: mistrel};
    setChatHistory((preHistory)=> (preHistory ? [...preHistory, aiMessage] : [aiMessage]));
  }
  const sendPreInfo = async ()=> {
    setLoading(true);
    const q = {data: question}
    console.log('uuuuu', q);
    const r = await postQuestion(q);
    const mistrel = new AiResponse(r.data)
    setRespone(mistrel);
    setLoading(false);
    const aiMessage: Message = {sender:'ai', message: mistrel};
    setChatHistory((preHistory)=> (preHistory ? [...preHistory, aiMessage] : [aiMessage]));
  }

  const handleClick = ()=> {
    navigate('/');
  }
  
  return (
    <ThemeProvider theme={chouetteTheme}>
        <Container >
            <h3>Chouette Hackathon</h3>
            {loading ? 
            <Box display='flex' justifyContent='center' alignItems='center' sx={{overflowY:'auto', height:'70vh', border:'1px solid #B5E8F7' }}>
            <Skeleton sx={{ bgcolor: '#B5E8F7', mergin:'10px' }}
                          variant="rectangular"
                          width='80%'
                          height='80%'
                          /> 
            </Box>
            :
            <Box sx={{overflowY:'auto', height:'70vh', border:'1px solid #B5E8F7' }}>
              {(chatHistory && chatHistory.length) && chatHistory.map((chat,index)=> {
                if (chat.sender === 'user' && typeof chat.message === 'string') {
                  return (
                  loading 
                  ? <Skeleton />
                  : <Box ref={ref} key={`${chat.sender}-${index}`} width='90%' my={2} display="flex" flexDirection="row" justifyContent="end" alignItems="end" gap={4} p={2}sx={{}}>
                    <Box sx={{fontSize:'18px'}}>{chat.message}</Box>
                    <InsertEmoticonRoundedIcon fontSize='small'/>
                  </Box>)
                } else if(chat.message instanceof AiResponse){
                  return (
                    loading  
                    ? <Skeleton />
                    : <Box ref={ref} key={`${chat.sender}-${index}`} width='90%' my={2} display="flex" flexDirection="row" justifyContent="start" alignItems="start" gap={4} p={2}sx={{}}>
                    <SmartToyIcon fontSize='small'/>
                    <Box display='flex' justifyContent='flex-start' sx={{fontSize:'18px'}}>{transformAiMessage(chat.message)}</Box>
                    </Box> 
                  )
                } 
                
              })}
            </Box>}
        {/* <form onSubmit={handleSubmit} style={{width:'100%'}}>
          <Box display='flex' flexDirection='row'>
            <TextField name='question' variant='filled' fullWidth onChange={(e)=>{setQuestion(e.target.value)}}/>
            <Button type='submit' variant='contained' color='primary' size='small' sx={{marginLeft:'4px'}}>Send</Button>

          </Box>
         
        </form> */}
        <Box display='flex' justifyContent='flex-end'>
        <Button variant='contained' color='primary' size='small' onClick={()=>handleClick()} sx={{margin:'5px'}}>Restart</Button>

        </Box>

        </Container>
        <CodeRef text={text} titles={titles} open={openDetail} setOpen={setOpenDetail}/>
    </ThemeProvider>
  )
}

export default Chat
