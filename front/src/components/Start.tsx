import mapboxgl from 'mapbox-gl';
import { Dispatch, SetStateAction } from 'react';
import { Box, Container, Grid, InputLabel, TextField, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import { chouetteTheme } from '../themes';
import { useNavigate } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import logo from '../assets/logo-chouette.png';
import avocat from '../assets/chouette-avocado.png';

mapboxgl.accessToken = import.meta.env.MAPBOXTOKEN
type StartProps = {
  preSet: PreInfo
  setPreSet: Dispatch<SetStateAction<PreInfo>>
}

type PreInfo = {
    address? : string,
    departement? : string,
    size? : number,
    inclinaison? : number,
    zone_type? : string,
    haie? : boolean,
    arbre? : boolean,
    riviere? : boolean,
    culture? : string,
    date? : string,
    old_culture? : string,
    old_date? : string,
    independant? : boolean,
    PAC? : boolean,
    temps_partiel? : boolean,
    commercialisation? : boolean,
   ask_aides: boolean,
}
  
function Start({preSet,setPreSet}: StartProps) {
  const navigate = useNavigate();
  
  const handleClick = (askAide:boolean) => {
    if(askAide) {
      const setInput: PreInfo = preSet;
      setInput['ask_aides'] = true;
      setPreSet(setInput)
    }
    navigate('/chat');
  }
  const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const setInput: PreInfo= preSet;
    const key =  e.target.name
    if (key in setInput) {
      setInput[key] = e.target.value;
    }
    setPreSet(setInput)
    console.log('input', e.target.value, e.target.name)
  }
  const handleCheck = (e) => {
    const setInput: PreInfo= preSet;
    setInput[e.target.name] = e.target.checked;
    setPreSet(setInput)
    console.log('check',setInput, e.target.checked)
  }
  return (
    <ThemeProvider theme={chouetteTheme}>
      <Container>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' justifyContent='flex-start' alignItems='center'>
            <img src={avocat} style={{width:'60px', height:'60px'}}/>
            <h1 style={{marginLeft:'10px'}}>Avocado</h1>
          </Box>
          <div><img src={logo} style={{height:'60px'}}/></div>

        </Box>
        <form>
        <Grid container spacing={1}>
          <Grid item xs={12} display='flex' justifyContent='flex-start'>
            <h3>Ma parcelle</h3>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Adresse</InputLabel>
            <TextField fullWidth name='address' variant='filled' defaultValue={preSet.address} onChange={(e)=>handleChange(e)} />
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Département</InputLabel>
            <TextField fullWidth name='departement' variant='filled' defaultValue={preSet.departement} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Taille de la parcelle (en hectare)</InputLabel>
            <TextField fullWidth name='size' variant='filled' defaultValue={preSet.size} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Inclinaison du terrain (en pourcentage)</InputLabel>
            <TextField fullWidth name='inclinaison' variant='filled' defaultValue={preSet.inclinaison} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Zone défavorisé</InputLabel>
            <TextField fullWidth name='zone_type' variant='filled' defaultValue={preSet.zone_type} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='haie' label="Haie" onChange={handleCheck}/>
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='arbre' label="Arbre" onChange={handleCheck}/>
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='riviere' label="Cours d'eau" onChange={handleCheck}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Type de culture voulue</InputLabel>
            <TextField fullWidth name='culture' variant='filled' defaultValue={preSet.culture} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>À partir du...</InputLabel>
            <TextField fullWidth name='date' variant='filled' defaultValue={preSet.date} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='commercialisation' label="Commercialisation" onChange={handleCheck}/>
          </Grid>
          <Grid item xs={12} md={16} display='flex' justifyContent='flex-start'>
            <h3>Antécedent de la parcelle</h3>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Culture</InputLabel>
            <TextField fullWidth name='old_culture' variant='filled' defaultValue={preSet.old_culture} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={6} >
            <InputLabel>Présente jusqu'au...</InputLabel>
            <TextField fullWidth name='old_date' variant='filled' defaultValue={preSet.old_date} onChange={(e)=>handleChange(e)}/>
          </Grid>
          <Grid item xs={12} md={16} display='flex' justifyContent='flex-start'>
            <h3>À propos de vous</h3>
          </Grid>
          <Grid item xs={6} >
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='independant' label="Indépendant" onChange={handleCheck}/>
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='temps_partiel' label="Temps partiel" onChange={handleCheck}/>
            <FormControlLabel control={<Checkbox sx={{color:'white'}}/>} name='PAC' label="Bénéficiaire PAC" onChange={handleCheck}/>
          
          </Grid>
          
        </Grid>
        <Box display='flex' justifyContent='flex-end'>
        <Button fullWidth variant='contained' color='primary' onClick={()=>handleClick(false)} sx={{margin:'5px'}}>Voir la réglementation</Button>
        <Button fullWidth variant='contained' color='primary' onClick={()=>handleClick(true)} sx={{margin:'5px'}}>Decouvrir les aides</Button>

        </Box>
        </form>
      </Container>
      
    </ThemeProvider>
  )
}

export default Start
