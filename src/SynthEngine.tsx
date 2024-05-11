import GenerateSequence from './NotesGeneration';
import React, { useEffect, useRef, useState } from 'react'
import { Song, Track, Instrument, Effect } from 'reactronica';
import { Donut } from 'react-dial-knob'
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { Button } from 'react-bootstrap';

function Keyboard({keyCodes}) {
  const keyColorPressed = "grey";
  const keyColorWhite = "lightgrey";
  const keyColorBlack = "black";

  function WhiteKey({dataKey, borderLeft, borderRight}) {
    let border = "0px";
    if(borderRight === true) border = "0px 0px 15px 0px";
    if(borderLeft === true) border = "0px 0px 0px 15px";
    return (
      <button data-key={dataKey} style={{ width: "50px", height: "100px", border: "2px solid", borderRadius: border, backgroundColor: keyCodes.includes(dataKey) ? keyColorPressed : keyColorWhite}}></button>
    )
  }

  function BlackKey({dataKey, width, position}) {
    return (
      <button data-key={dataKey} style={{ width: width+"px", height: "65px", border: "2px solid", position: "absolute", backgroundColor: keyCodes.includes(dataKey) ? keyColorPressed : keyColorBlack, left: position+"px"}}></button>
    )
  }

  return(
    <>
      <div style={{width: "fit-content", position: "absolute", margin: "0 0 10 0 auto"}}>
        <WhiteKey dataKey={65} borderLeft={true} borderRight={false}/>
        <BlackKey dataKey={87} width={25} position={35}/>
        <WhiteKey dataKey={83} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={69} width={25} position={90}/>
        <WhiteKey dataKey={68} borderLeft={false} borderRight={false}/>
        <WhiteKey dataKey={70} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={84} width={25} position={185}/>
        <WhiteKey dataKey={71} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={89} width={25} position={237}/>
        <WhiteKey dataKey={72} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={85} width={25} position={290}/>
        <WhiteKey dataKey={74} borderLeft={false} borderRight={false}/>
        <WhiteKey dataKey={75} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={79} width={25} position={385}/>
        <WhiteKey dataKey={76} borderLeft={false} borderRight={false}/>
        <BlackKey dataKey={80} width={25} position={440}/>
        <WhiteKey dataKey={186} borderLeft={false} borderRight={false}/>
        <WhiteKey dataKey={222} borderLeft={false} borderRight={true}/>
        <BlackKey dataKey={221} width={20} position={530}/>
      </div>
    </>
  )
}

function SynthEngine() {

  /* Declare state variables */
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [tempo, setTempo] = React.useState(120);
  const [volume, setVolume] = useState(-4)
  const [delayAmount, setDelayAmount] = useState(0)
  const [distortionAmount, setDistortion] = useState(0)
  const [reverbAmount, setReverbAmount] = useState(0)
  const [autoFilterAmount, setAutoFilterAmount] = useState(0)
  const [tremoloAmount, setTremoloAmount] = useState(0)
  const [steps, setSteps] = useState([["C3"], 1]);
  const [notes, setNotes] = useState([{name: ""}])
  const [oscillatorType, setOscillatorType] = useState('sine')
  const [synthType, setSynthType] = useState('fmSynth')
  const [keyCodes, setKeyCodes] = useState(Array)

  const handleTempoChange = (event) => {
    setTempo(parseInt(event.target.value))
  }

  const keyMap = {
    65:"C3",
    87:"C#3",
    83:"D3",
    69:"D#3",
    68:"E3",
    70:"F3",
    84:"F#3",
    71:"G3",
    89:"G#3",
    72:"A3",
    85:"A#3",
    74:"B3",
    75:"C4",
    79:"C#4",
    76:"D4",
    80:"D#4",
    186:"E4",
    222:"F4",
    221:"F#4",
  }

  const playNote = (event) => {
    if(keyMap[event.keyCode] && notes.length < 2) {
      const noteArr = {name: keyMap[event.keyCode]};
      setNotes(oldNotes => [...oldNotes, noteArr]);
      setKeyCodes(oldCodes => [...oldCodes, event.keyCode]);
    }
  }

  const removeNotes = (event) => {
    setNotes(notes.filter(note => note !== keyMap[event.keyCode]))
    setKeyCodes(keyCodes.filter(key => key !== event.keyCode))
  }

  const myRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", playNote);
    document.addEventListener("keyup", removeNotes);
    return () => {
      document.removeEventListener("keydown", playNote);
      document.removeEventListener("keyup", removeNotes);
    };
  }, [])

  return (
    <>
      <Song bpm={tempo} isPlaying={isPlaying}>
        <Track
          steps={steps}
          volume={volume}
        >
          <Instrument type={synthType} oscillator={oscillatorType} notes={notes}/>

          {/* Setup the effect chain */}
          <Effect type="tremolo" wet={tremoloAmount} />
          <Effect type="distortion" wet={distortionAmount} />
          <Effect type="freeverb" wet={reverbAmount} />
          <Effect type="feedbackDelay" wet={delayAmount} />
          <Effect type="autoFilter" wet={autoFilterAmount} />
        </Track>
      </Song>

      <Stack spacing={2} direction="row" sx={{ mb: 10, mt: 10 }} alignItems="center" className='CenterAlign'>
        <Keyboard keyCodes={keyCodes}/>
      </Stack>

      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" className='CenterAlign'>
        <Donut
          diameter={100}
          min={0}
          max={1}
          step={.25}
          value={tremoloAmount}
          theme={{
            donutColor: 'darkred',
            donutThickness: 14
          }}
          onValueChange={setTremoloAmount}
          ariaLabelledBy={'tremolo-amount'}
        >
          <label style={{color: "white"}} id={'tremolo-amount'}>Tremolo</label>
        </Donut>

        <Donut
          diameter={100}
          min={0}
          max={1}
          step={.25}
          value={distortionAmount}
          theme={{
            donutColor: 'red',
            donutThickness: 14
          }}
          onValueChange={setDistortion}
          ariaLabelledBy={'delay-amount'}
        >
          <label style={{color: "white"}} id={'delay-amount'}>Distortion</label>
        </Donut>

        <Donut
          diameter={100}
          min={0}
          max={1}
          step={.25}
          value={reverbAmount}
          theme={{
            donutColor: 'orange',
            donutThickness: 14
          }}
          onValueChange={setReverbAmount}
          ariaLabelledBy={'reverb'}
        >
          <label style={{color: "white"}} id={'reverb'}>Reverb</label>
        </Donut>
      </Stack>

      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" className='CenterAlign'>
        <Donut
          diameter={100}
          min={0}
          max={1}
          step={.25}
          value={delayAmount}
          theme={{
            donutColor: 'purple',
            donutThickness: 14
          }}
          onValueChange={setDelayAmount}
          ariaLabelledBy={'delay-amount'}
        >
          <label style={{color: "white"}} id={'delay-amount'}>Delay</label>
        </Donut>

        <Donut
          diameter={100}
          min={0}
          max={1}
          step={.25}
          value={autoFilterAmount}
          theme={{
            donutColor: 'green',
            donutThickness: 14
          }}
          onValueChange={setAutoFilterAmount}
          ariaLabelledBy={'delay-amount'}
        >
          <label style={{color: "white"}} id={'delay-amount'}>AutoFilter</label>
        </Donut>

        <Donut
          diameter={100}
          min={-50}
          max={10}
          step={1}
          value={volume}
          theme={{
            donutColor: 'blue',
            donutThickness: 14
          }}
          onValueChange={setVolume}
          ariaLabelledBy={'volume'}
        >
          <label style={{color: "white"}} id={'volume'}>Volume</label>
        </Donut>
      </Stack>

      <br />
      <br />

      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" className='CenterAlign'>
        <FormControl component="fieldset">
          <FormLabel style={{color: "white"}} component="legend">Synth Engine</FormLabel>
          <RadioGroup
            aria-label="synth-engine"
            defaultValue="duoSynth"
            name="radio-buttons-group"
          >
            <FormControlLabel style={{color: "white"}} value="amSynth" control={<Radio onClick={() => {setSynthType('amSynth')}} />} label="amSynth" />
            <FormControlLabel style={{color: "white"}} value="fmSynth" control={<Radio onClick={() => setSynthType('fmSynth')} />} label="fmSynth" />
            <FormControlLabel style={{color: "white"}} value="duoSynth" control={<Radio onClick={() => setSynthType('duoSynth')} />} label="duoSynth" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel style={{color: "white"}} component="legend">Oscillator Type</FormLabel>
          <RadioGroup
            aria-label="synth-engine"
            defaultValue="triangle"
            name="radio-buttons-group"
          >
            <FormControlLabel style={{color: "white"}} value="sine" control={<Radio onClick={() => setOscillatorType('sine')} />} label="Sine" />
            <FormControlLabel style={{color: "white"}} value="triangle" control={<Radio onClick={() => setOscillatorType('triangle')} />} label="Triangle" />
            <FormControlLabel style={{color: "white"}} value="square" control={<Radio onClick={() => setOscillatorType('square')} />} label="Square" />
          </RadioGroup>
        </FormControl>
      </Stack>

      <Stack alignItems="center">
          <br />

        <button
          style={{
            fontSize: '1.5rem',
            color: "white",
            backgroundColor: "grey"
          }}

          onClick={() => {
            setSteps(GenerateSequence);
          }}
        >
          {'Generate sequence'}
        </button>

        <p style={{color: "white"}}>
          Current sequence:
          <br />
          {steps.join('-')}
        </p>

        <div style={{marginBottom: "20px"}}>
          <label style={{fontSize: "20px", fontWeight: "bold", marginRight: "10px", color: "white"}}>BPM:</label>
          <input type="number" style={{width: "50px", fontSize: "20px"}} value={tempo} onChange={handleTempoChange}>
          </input>
        </div>

        <button
          style={{
            fontSize: '2rem',
            color: 'white',
            backgroundColor: 'grey'
          }}

          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>


        <br />
        <br />
        <br />
        <br />
        <br />

      </Stack>
    </>
  );
}

export default SynthEngine;