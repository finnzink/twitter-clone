import React from 'react';
import './App.css';
import '@instructure/canvas-theme';

import { TreeBrowser } from '@instructure/ui-tree-browser'

const App = () => {
    const [collections, setCollections] = React.useState({
        1: {
            id: 1,
            name: "Home",
            collections: [2,3],
            items: [3]
          },
          2: { id: 2, name: "English Assignments", collections: [4], items: [] },
          3: { id: 3, name: "Math Assignments", collections: [5], items: [1,2] },
          4: { id: 4, name: "Reading Assignments", collections: [], items: [4] },
          5: { id: 5, name: "Advanced Math Assignments", items: [5]}
        });

    const [items, setItems] = React.useState({
        1: { id: 1, name: "Addition Worksheet" },
        2: { id: 2, name: "Subtraction Worksheet" },
        3: { id: 3, name: "General Questions" },
        4: { id: 4, name: "Vogon Poetry" },
        5: { id: 5, name: "Bistromath", descriptor: "Explain the Bistromathic Drive" }
      });
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [folder, setFolder] = React.useState(collections[1]); 
  const [files, setFiles] = React.useState(null); // set of file, name, content pairs
  const [file, setFile] = React.useState(null); // current file info

  const handleSearch = event => {
      if (event.type === "click") {
        console.log("change to: " + searchTerm);
        let tempCollections = collections; 
        tempCollections[folder.id].name = searchTerm; 
        setCollections(tempCollections);
        setFolder(tempCollections[folder.id]); 
      }
      setSearchTerm(event.target.value);
  };

  const handleToggle = (collection) => {
    setFolder(collections[[collection.id]]); 
    setFile(null); 
  };

  const handleItemClick = (item) => {
      let file = { id: item.id, contents: "", name: item.name};
      setFile(items[[item.id]]);
      // have to call setFolder as well
      for (let i = 1; i <= Object.keys(collections).length; i++) {
        let ourFile = collections[i]; 
        if (ourFile.items.includes(item.id))
        {
            setFolder(collections[i]);
            break; 
        }
      }
  };

  return (
      
    <div>
        <div>
            <h1>Welcome to the self destructing file browser!</h1>
        </div>
        <div>
            <div className='smallCol'>
            <TreeBrowser 
                collections = {collections}
                items = {items}
                defaultExpanded={[1, 3]}
                rootId={1}
                onCollectionToggle={handleToggle}
                onItemClick={handleItemClick}
            />
            </div>
            <div className='smallCol'>
                <EditFolder onSearch={handleSearch} folder={folder}/>
            </div>
            <div className='bigCol'>
                <EditFile file={file}/>
            </div>
        </div>
    </div>
  );
};

const EditFolder = ({onSearch, folder}) => (
    <div>
        <h3>In folder {folder.name}</h3>
        <label >Change folder name:</label>
        <input  name="folder-name" type="text" onChange={onSearch}/>
        
        <button type="button" onClick={onSearch}>Change</button>

        {/* <p>
        <strong>{search}</strong>
        </p>  */}
        <p></p>
        <label>Add file with name:</label>
        <input/>
        <button type="button">Add</button>
        <p></p>
        <label>Add subfolder with name:</label>
        <input/>
        <button type="button">Add</button>
    </div>
);

function EditFile ({file}) { 
    if (file == null) {
        return <div><h3>Not editing anything</h3></div>
    }
    else {
        return (
            <div>
                <h3>Editing {file.name}</h3>
                <p>{file.contents}</p>
                <textarea rows="20" cols="100"></textarea>
            </div>
        );
    }
}

export default App;
