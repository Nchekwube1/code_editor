import  {useState,useRef} from 'react';
import './App.css';
import prettier from "prettier"
import parser from "prettier/parser-babel"
import CodeEditor,{OnMount} from './compnents/code-editor';
import Preview from './compnents/Preview';
import Index from './bundler';
function App() {
  const [input,setInput] = useState<string>("")
  const [code,setCode] = useState<string>("")
  const editorRef = useRef<any>()

const handleEditorChange:OnMount = (editor ,monaco) =>{
  editorRef.current = editor
  editor.onDidChangeModelContent(()=>{
    setInput(editorRef.current.getValue())
  })
  }
  const formatContent = ()=>{
    const unformatted = editorRef.current.getValue()
    console.log(unformatted)
    const formatted =prettier.format(unformatted,{
    parser:"babel",
    plugins:[parser],
    useTabs:false,
    semi:true,
    singleQuote:true
    }).replace("/\n$/","")

    editorRef.current.setValue(formatted)

  }

  

  const sub =  async(e:any)=>{

    e.preventDefault()
    const res = await Index(input)

   setCode(res)

   setInput("")
 }

  return (
    <div className="App">
      <form onSubmit={sub}>
        <CodeEditor initialValue="" onMount={handleEditorChange} formatContent={formatContent} />
        <button type="submit">submit</button>
      </form>
      <Preview code={code}/>

    </div>
  );
}

export default App;
