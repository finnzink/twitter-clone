import React from 'react';
import './App.css';
import '@instructure/canvas-theme';

import { TreeBrowser } from '@instructure/ui-tree-browser'

const App = () => {
    const [collections, setCollections] = React.useState({
        1: { id: 1, name: "Home", collections: [], items: [1] }
    });

    const [items, setItems] = React.useState({
        1: { id: 1, name: "Click me!" , 
        content: `This is a file navigator which will reset if you refresh the page. 
            As long as you don't do that, you can create, delete and rename both files and folders. 
            You can also navigate in the subtree. `}
      });
  
    const [folderName, setFolderName] = React.useState('');
    const [folder, setFolder] = React.useState(collections[1]); 
    const [file, setFile] = React.useState(null); // current file info
    const [filename, setFilename] = React.useState(''); 
    const [append, setAppend] = React.useState('');
    const [newFolderName, setNewFolderName] = React.useState(''); 
    const [newFileName, setNewFileName] = React.useState(''); 

    const handleFolderNameChange = event => {
        if (event.type === "click") {
            let tempCollections = collections; 
            tempCollections[folder.id].name = folderName; 
            setCollections(tempCollections);
            setFolder(tempCollections[folder.id]); 
        }
        setFolderName(event.target.value);
    };

    const handleToggle = (collection) => {
        setFolder(collections[[collection.id]]); 
        setFile(null); 
    };

    const handleItemClick = (item) => {
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

    const handleAppend = event => {
        if (event.type === "click") {
            let tempItems = items; 
            tempItems[file.id].content = tempItems[file.id].content.concat(append); 
            setItems(tempItems); 
            document.getElementById("append").value = "";
        }
        setAppend(event.target.value); 
    }; 

    const handleFileChange = event => {
        if (event.type === "click"){
            //console.log("changing " + items[file.id].name + " to " + event.target.value); 
            let tempItems = items;
            tempItems[file.id].name = filename;
            setItems(tempItems);
        }
        setFilename(event.target.value); 
    }; 

    const handleAddFile = event => {
        if (event.type === "click" && newFileName !== "") {
            let tempItems = items; 
            let id = Object.keys(items).length + 1; 
            tempItems[id] = {id:id, name:newFileName, content:""};
            setItems(tempItems); 
            // add to parent collection's items
            let tempCollections = collections; 
            let tempCollection = collections[folder.id]; 
            tempCollection.items.push(id); 
            tempCollections[folder.id] = tempCollection; 
            setCollections(tempCollections); 
            document.getElementById("add-file").value = "";
            setFile(tempItems[id]); 
        }
        setNewFileName(event.target.value); 
    };
    const handleAddFolder = event => {
        if (event.type === "click"  && newFolderName !== "") {
            let tempCollections = collections; 
            let id = Object.keys(collections).length + 1; 
            tempCollections[id] = {id:id, name:newFolderName, collections: [], items:[]}
            // add to parent collection's collections
            let tempCollection = collections[folder.id]; 
            tempCollection.collections.push(id); 
            tempCollections[folder.id] = tempCollection; 
            setCollections(tempCollections); 
            document.getElementById("add-folder").value = "";
            setFolder(tempCollections[id]); 
            setFile(null); 
        }
        setNewFolderName(event.target.value); 
    }; 
    const handleDeleteFile = event => {
        let tempCollections = collections; 
        let tempCollection = folder;
        tempCollection.items.splice(tempCollection.items.indexOf(file.id), 1); 
        tempCollections[folder.id] = tempCollection; 
        delete folder.items[tempCollections]; 
        setCollections(tempCollections); 

        let tempItems = items; 
        delete tempItems[file.id]; 
        setItems(tempItems); 

        setFile(null); 
    }; 

    const handleDeleteFolder = event => {
        let tempCollections = collections; 
        let c = null; 
        for (let i = 1; i <= Object.keys(tempCollections).length; i++) {
            c = tempCollections[i]; 
            if (c.collections.includes(folder.id)) {
                c.collections.splice(c.collections.indexOf(folder.id), 1); 
                break; 
            } 
        }
        delete collections[folder.id]; 
        setCollections(tempCollections)

        setFolder(c); 
    };  

  return (
      
    <div>
        <h1>The self destructing file browser</h1>
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
            <div className='folder'>
                <EditFolder 
                    onFolderNameChange={handleFolderNameChange} 
                    folder={folder}
                    onAddFile={handleAddFile}
                    onAddFolder={handleAddFolder}
                    onDeleteFolder={handleDeleteFolder}
                />
            </div>
            <div className='bigCol'>
                <EditFile 
                    file={file} 
                    onDeleteFile={handleDeleteFile} 
                    onAppend={handleAppend} 
                    onFileChange={handleFileChange} 
                    append={append}
                />
            </div>
        </div>
    </div>
  );
};

const EditFolder = ({onFolderNameChange, folder, onAddFile, onAddFolder, onDeleteFolder}) => (
    <div  >
        <h3>In folder {folder.name}</h3>
        <label >Change folder name:</label>
        <input onChange={onFolderNameChange}/>
        
        <button type="button" onClick={onFolderNameChange}>Change</button>

        {/* <p>
        <strong>{search}</strong>
        </p>  */}
        <p></p>
        <label>Add file with name:</label>
        <input id="add-file" onChange={onAddFile}/>
        <button type="button" onClick={onAddFile}>Add</button>
        <p></p>
        <label>Add subfolder with name:</label>
        <input id="add-folder" onChange={onAddFolder}/>
        <button type="button" onClick={onAddFolder}>Add</button>
        <p/>
        <br/>
        <button onClick={onDeleteFolder}>Delete Folder</button>
    </div>
);

function EditFile ({file, onDeleteFile, onAppend, onFileChange, append}) { 
    if (file == null) {
        return <div><h3>Not editing anything</h3></div>
    }
    else {
        return (
            <div>
                <h3>{file.name}</h3>
                <p>{file.content}<span style={{color:'blue'}}>{append}</span></p>
                <textarea id="append" rows="10" cols="50" type="text" onChange={onAppend}></textarea>
                <button type="button" onClick={onAppend}>Append</button>
                <button type="button" onClick={onDeleteFile}>Delete File</button>
                <p></p>
                <label>Change file name:</label>
                <input onChange={onFileChange}/>
                <button onClick={onFileChange} type="button">Change</button>
            </div>
        );
    }
}

export default App;
