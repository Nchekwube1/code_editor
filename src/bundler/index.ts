import * as esbuild_wasm from "esbuild-wasm"
import {unpkgPathplugin} from "./plugins/unpkg_path"
import {buildPlugin} from "./plugins/build_plugin"
let service = false;
const Index =  async (rawCode:string)=>{
 if( service === false){
      await esbuild_wasm.initialize({
     worker:true,
     wasmURL:"https://unpkg.com/esbuild-wasm@0.13.13/esbuild.wasm"
   })
   service = true

 }

  

 const result = await esbuild_wasm.build({
     bundle:true,
     write:false,
     entryPoints:["index.js"],
     plugins:[unpkgPathplugin(), buildPlugin(rawCode)],
       define: { 'process.env.NODE_ENV': '"production"',
         'global':'"window"'
       }
 
   })

   return result.outputFiles[0].text


 
}



export default Index