import * as esbuild from "esbuild-wasm"
import localforage from "localforage"
import axios from "axios"

const fileCache = localforage.createInstance({
    name:"cacheDb"
})

export const unpkgPathlugin = (inputCode:string)=>{
 return{
     name:"unpkg-path-plugin",
     setup(build:esbuild.PluginBuild){
     build.onResolve({filter:/.*/}, async (args:any)=>{
         console.log("onResolve",args)
      if(args.path === "index.js"){
          return {path:args.path, namespace:"a" }
    
    }

      if(args.path.includes("./") || args.path.includes("../")){
      return{
          namespace:"a",
          path: new URL(args.path,"https://unpkg.com" + args.resolveDir +"/" ).href
      }
    }


    return{
        namespace:"a",
        path:`https://unpkg.com/${args.path}`
    }

     })

       build.onLoad({filter:/.*/},  async (args:any)=>{
    console.log("onLoad",args )
     
    if(args.path === "index.js"){
        return {
            loader:"jsx",
            contents:inputCode
        }
    }

  
    const cache = await fileCache.getItem<esbuild.OnLoadResult>(args.path)

    if (cache){
        return cache
    }

    const {data,request} = await axios.get(args.path)
       return {
            loader:"jsx",
            contents:data,
            resolveDir:new URL("./",request.responseURL).pathname
        }

     })
     }
 }
}