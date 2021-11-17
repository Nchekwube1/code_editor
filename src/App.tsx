import React, {useEffect,useState,useRef} from 'react';
import './App.css';
import * as esbuild_wasm from "esbuild-wasm"
import {unpkgPathplugin} from "./plugins/unpkg_path"
import {buildPlugin} from "./plugins/build_plugin"
function App() {
  const [input,setInput] = useState("")
  // const [code,setCode] = useState<string>("")


  const ref = useRef<any>()
  const iframe = useRef<any>()
  const startService = async()=>{
  await esbuild_wasm.initialize({
     worker:true,
     wasmURL:"https://unpkg.com/esbuild-wasm@0.13.13/esbuild.wasm"
   })

    ref.current = true
  }
  
  const html =  `
<html>
<head>
</head>
<body>
 <div id="root">
 </div>
<script>
window.addEventListener("message",(event)=>{
  try{
    eval(event.data)
  }
  catch(err){
    const root = document.getElementById("root")
    root.innerHTML = '<div style="color:red;"><h4>Runtime Error </h4>' + err + '</div>'
  }
},false)
</script>
</body>
</html>
  `

  useEffect(()=>{
    startService()
        },[])

  const sub =  async(e:any)=>{

    e.preventDefault()
    iframe.current.srcdoc = html
    if(!ref.current){
      return
    }
    const target = await esbuild_wasm.build({
     bundle:true,
     write:false,
     entryPoints:["index.js"],
     plugins:[unpkgPathplugin(), buildPlugin(input)],
       define: { 'process.env.NODE_ENV': '"production"',
         'global':'"window"'
       }
 
   })

   iframe.current.contentWindow.postMessage(target.outputFiles[0].text,"*")
   setInput("")
 }

  return (
    <div className="App">
      <form onSubmit={sub}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} ></textarea>
        <button type="submit">submit</button>
      </form>

      <iframe ref={iframe} srcDoc={html} title="code runner"  />
    </div>
  );
}

export default App;
