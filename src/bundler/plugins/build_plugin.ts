import * as esbuild from "esbuild-wasm"
import localforage from "localforage"
import axios from "axios"

const fileCache = localforage.createInstance({
    name:"cacheDb"
});


export const buildPlugin =(inputCode?:string)=>{
    return{
        name:"build Plugin",
        setup(build:esbuild.PluginBuild){
            
 build.onLoad({filter:/.*/},  async (args:any)=>{
           
    const cache = await fileCache.getItem<esbuild.OnLoadResult>(args.path)

    if (cache){
        return cache
    }
      
 })

        build.onLoad({filter:/.css$/},async(args:any)=>{
 
    const {data,request} = await axios.get(args.path)
    const escaped = data.replace(/\n/g,"").replace(/"/g,'\\" ').replace(/'/g,"\\' ")
    const contents = `
     const style = document.createElement("style");
     style.innerText= '${escaped}';
     document.head.appendChild(style);
    `
       const result:esbuild.OnLoadResult =  {
            loader:"jsx",
            contents,
            resolveDir:new URL("./",request.responseURL).pathname
        }

        await fileCache.setItem(args.path, result)

        return result
        })



 build.onLoad({filter:/^index\.js$/},async(args:any)=>{

               return {
            loader:"jsx",
            contents:inputCode
        }
             })
 build.onLoad({filter:/.*/},  async (args:any)=>{
    const {data,request} = await axios.get(args.path)

       const result:esbuild.OnLoadResult =  {
            loader:"jsx",
            contents:data,
            resolveDir:new URL("./",request.responseURL).pathname
        }

        await fileCache.setItem(args.path, result)

        return result

     })
        }
    }
}