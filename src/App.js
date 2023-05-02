import { useState, useEffect } from "react";
const serverURL = 'https://chatgpt-clone-server-production.up.railway.app';
function App() {
  const [message, setMessage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [currentTitle, setCurrentTitle] = useState('Sample');
  const [previousChats, setPreviousChats] = useState([{
    role: "user",
    content: " :  Hello, How are you ?",
    title: 'Sample'
  }, {
    role: "assistant",
    content: " :  I am fine thanks!",
    title: 'Sample'
  }]);
  useEffect(() => {
    console.log(prompt, message, currentTitle);
    if (!currentTitle && prompt && message) {
      setCurrentTitle(prompt); 
    }
    if (currentTitle && prompt && message) {
      setPreviousChats((prevChats) => {
        return ([...prevChats, {
          role: "user",
          content: prompt,
          title: currentTitle
        }, {
          role: message.role,
          content: message.content,
          title: currentTitle
        }])
      })
    }
  }, [message, currentTitle])
  const handleChatChange = (title)=>{
    console.log(title);
    setCurrentTitle(title);
    setMessage(null);
    setPrompt('');
  }
  async function getMessage() {
    try {
      let response = await fetch(`${serverURL}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
      let data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }
  function createNewChat(){
    setMessage(null);
    setPrompt('');
    setCurrentTitle(null);
  }
console.log(previousChats);
const currentChat = previousChats.filter((chat)=> chat.title===currentTitle);
const uniqueTitles = Array.from(new Set(previousChats.map(previousChat=>previousChat.title)));
console.log(uniqueTitles);
  return (
    <div className="App">
      <section className="sidebar">
        <h1 style={{ textAlign: 'center' }}>IntelliChat</h1>
        <button onClick={createNewChat} className="sidebar__newchatbtn">&nbsp; + &nbsp;&nbsp;New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((title, index)=>{
            return <li onClick={()=>{handleChatChange(title)}} key={index}>{title}</li>;
          })}
        </ul>
        <nav>Made by Sujal</nav>
      </section>
      <section className="main">
        <h1>SujalGPT</h1>
        <ul className="feed">

       { currentChat?.map((chatMessage, index) => {
          return <li style={chatMessage.role==='user' ? {backgroundColor: '#343541'} : {backgroundColor: '#444654'}} className="__chatitem" key={index}>
            <p>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
              </li>;
        })
}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input type="text" value={prompt} onChange={(e) => { setPrompt(e.target.value) }} placeholder="Ask a question, get something translated etc." />
            <div id="submit" onClick={getMessage}>➡️</div>
          </div>
          <p className="info">Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT Mar 23 Version</p>
        </div>
      </section>
    </div>
  );
}

export default App;
