import React, {useEffect,useState,useRef} from 'react';
import './App.css';
import * as esbuild_wasm from "esbuild-wasm"
import {unpkgPathlugin} from "./plugis/unpkg_path"
function App() {
  const [input,setInput] = useState("")
  const [code,setCode] = useState<string>("")
  const ref = useRef<any>()
  const startService = async()=>{
  await esbuild_wasm.initialize({
     worker:true,
     wasmURL:"/esbuild.wasm"
   })

    ref.current = true
  }
  
  useEffect(()=>{
    startService()
        },[])

  const sub =  async(e:any)=>{

    e.preventDefault()
    if(!ref.current){
      return
    }
    const target = await esbuild_wasm.build({
     bundle:true,
     write:false,
     entryPoints:["index.js"],
     plugins:[unpkgPathlugin(input)],
       define: { 'process.env.NODE_ENV': '"production"',
         'global':'"window"'
       }
 
   })

   console.log(target)
   setCode(target.outputFiles[0].text)
   setInput("")
    // console.log("submit",target)
 }

  return (
    <div className="App">
      <form onSubmit={sub}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} ></textarea>
        <button type="submit">submit</button>
      </form>

      <h2>{code}</h2>
    </div>
  );
}

export default App;
