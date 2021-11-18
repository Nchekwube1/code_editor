import React,{useEffect,useRef,FC} from 'react'

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

interface previewProp {
code:string
}
const Preview:FC<previewProp> = ({code}) => {
  const iframe = useRef<any>()

    useEffect(()=>{
    iframe.current.srcdoc = html
   iframe.current.contentWindow.postMessage(code,"*")
   
    },[code])
    return (
      <iframe  ref={iframe} srcDoc={html} title="code preview"/>
    )
}

export default Preview
