import { useState, useEffect, useRef } from "react";
const serverURL = 'https://chatgpt-clone-server-production.up.railway.app';
// const serverURL = 'http://localhost:8000';
function App() {
  const messagesEndRef = useRef(null)
  const [generatingRes,setGeneratingRes] = useState(false);
  const [message, setMessage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [currentTitle, setCurrentTitle] = useState('What is Javascript?');
  const [previousChats, setPreviousChats] = useState([
    {
        "role": "user",
        "content": "What is Javascript?",
        "title": "What is Javascript?"
    },
    {
        "role": "assistant",
        "content": "JavaScript is a high-level, scripting programming language that is widely used to create interactive web pages, mobile applications, and desktop applications. It provides a way to add interactivity, animation, and dynamic effects to web pages. JavaScript code is executed on the client-side, meaning that it runs directly in the user's web browser after being downloaded from the web server. It is an essential component of modern web development and is used in conjunction with other technologies such as HTML, CSS, and server-side programming tools",
        "title": "What is Javascript?"
    }
]);


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
      console.log(1);
      setPrompt('');
    }
    setGeneratingRes(false);
    // eslint-disable-next-line
  }, [message, currentTitle])
  const handleChatChange = (title)=>{
    setCurrentTitle(title);
    setMessage(null);
    setPrompt('');
  }
  async function getMessage() {

    try {
      setGeneratingRes(true);
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
      console.log(data);
      setMessage(data?.choices[0].message);
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
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

useEffect(() => {
  scrollToBottom()
}, [currentChat]);
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
            <img className="role-img" src={chatMessage.role==='user'?"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png"} alt="role-img"/>
            <p>{chatMessage.content}</p>
              </li>;
        })     
}
        <div ref={messagesEndRef} />  
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <img className="loading-img" style={{display : generatingRes?'block':'none'}} src="/assets/img/loading.png" alt="loading-gif"/>
            <input onKeyDown={(e)=>{if(e.key==='Enter'){prompt?.trim()!='' && getMessage();}}} type="text" value={prompt} onChange={(e) => { setPrompt(e.target.value) }} placeholder="Ask a question, get something translated etc." />
            <div id="submit" onClick={prompt?.trim()!='' && getMessage}>➡️</div>
          </div>
          <p className="info">Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT Mar 23 Version</p>
          <p className="info">Note : Answer to your prompt will be limited to approx 75 words only.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
