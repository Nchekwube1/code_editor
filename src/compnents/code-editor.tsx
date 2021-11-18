import MonacoEditor from "@monaco-editor/react"
import React from "react"
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// export type OnChange = (
//   value: string | undefined,
//   ev: monaco.editor.IModelContentChangedEvent,
// ) => void;
export type Monaco = typeof monaco;

// Editor
export type OnMount = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monaco: Monaco,
) => void;
interface CodeEditorProps{
    initialValue:string,
    onMount:OnMount,
   formatContent: () => void
}
const CodeEditor:React.FC<CodeEditorProps> = ({initialValue,onMount,formatContent})=>{
   
    return(
       <div className="wrap">
               <button onClick={formatContent}>format</button>
           <MonacoEditor
    onMount={onMount}
    theme="vs-dark" height="200px" language="javascript" value={initialValue}
    options={{
        wordWrap:"on",
        minimap:{enabled:false},
        showUnused:false,
        folding:false,
        lineNumbersMinChars:3,
        fontSize:16,
        scrollBeyondLastLine:false,
        automaticLayout:true
    }}
    />
       </div>
          
       
    )
}

export default CodeEditor