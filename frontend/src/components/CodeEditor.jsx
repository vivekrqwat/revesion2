  import React from 'react'
  import  Editor  from 'react-simple-code-editor'
  import {highlight, languages} from 'prismjs/components/prism-core'
  import 'prismjs/components/prism-clike'
  import 'prismjs/components/prism-javascript'
  import 'prismjs/components/prism-python'
 import 'prism-themes/themes/prism-vsc-dark-plus.css'

  export default function CodeEditor({cd}) {
    
      const[lang,setlang]=React.useState('javascript');
    return (
      <div>
        
          <Editor
              value={cd}
              readOnly={true}
            
              highlight={(code) => highlight(code, languages[lang]||languages.js)}
              padding={10}
              style={{
             fontFamily: '"Fira Code", "Courier New", monospace',
              fontSize: 14,
              backgroundColor: '#262626',
              color: 'white'
              }}
          />
        
      </div>
    )
  }
