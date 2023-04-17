import { auth } from "./firebase";
import { GrSend } from 'react-icons/gr';
import { ImBin } from 'react-icons/im';
import { useState } from 'react';
import { useEffect } from "react";
import axios from "axios";
import Typewriter from 'typewriter-effect/dist/core';
import TextAnimation from "react-text-animations";
import './App.css'

var msg;

function Profile() {
    const [message, setMessage] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [sample, setSample] = useState(true);
    const [feedback, setFeedback] = useState(false);
    const [feedbackName, setFeedbackName] = useState("");
    const [feedbackEmail, setFeedbackEmail] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [selfFixable, setSelfFixable] = useState("");
    const [githubID, setGithubID] = useState("");
    const [akinator, setAkinator] = useState(false);
    const [akinatorStarted, setAkinatorStarted] = useState(false);
    const [akinatorCount, setAkinatorCount] = useState(0);
    const [akinatorGuessMade, setAkinatorGuessMade] = useState(false);

    const logout = () => {
        auth.signOut();
    }

    const RemovePlaceholder = () => {
        document.getElementById("animeplaceholder").style.display = "none";
        document.getElementById("input-chat").focus();
    }

    useEffect(() => {
        const placeholdertext = document.getElementById("animeplaceholder") && document.getElementById("input-chat") && document.getElementById("chating");
        placeholdertext.addEventListener("click", RemovePlaceholder);

        return () => {
            // clean up function to remove the event listener
            placeholdertext.removeEventListener("click", RemovePlaceholder);
        };
    }, []);

    const sendApiRequest = async (message, count) => {
        const msgObj = {
            "prompt": message,
        }
        await axios.post("https://ai-chatbot-backend-vbtjd5yyqq-el.a.run.app/application/ask", msgObj).then((res) => {
            setSpinner(false);
            if (res.data.image_requested) {
                document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
            <img src=${res.data.image_link} alt="profile" class="resImage"/>
            </div>`;
                var element = document.getElementById("msg-box");
                element.scrollTop = element.scrollHeight;
            }
            else {
                msg = res.data;
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p id="typewriter_${count}"></p>
                </div>`;
                new Typewriter(`#typewriter_${count}`, {
                    strings: msg,
                    autoStart: true,
                    loop: false,
                    delay: 50,
                });
                element = document.getElementById("msg-box");
                element.scrollTop = element.scrollHeight;
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const startAkinator = async (randomString) => {
        await axios.post("http://localhost:3000/application/akinator/start").then((res) => {
            setAkinator(true);
            document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
            <p id="typewriter_0${randomString}"></p>
            </div>`;
            new Typewriter(`#typewriter_0${randomString}`, {
                strings: res.data.question,
                autoStart: true,
                loop: false,
                delay: 50,
            });
            setAkinatorCount(akinatorCount + 1);
        }).catch((err) => {
            console.log(err);
        })
    }

    const akinatorGuess = async (guess, randomString) => {
        const guessObj = {
            "guess": guess,
        }
        await axios.post("http://localhost:3000/application/akinator/guess", guessObj).then(async(res) => {
            if(res.data.guess!=="" && res.data.guess!==undefined && res.data.guess!==null){
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p id="typewriter_${akinatorCount}${randomString}"></p>
                </div>`;
                new Typewriter(`#typewriter_${akinatorCount}${randomString}`, {
                    strings: "Is "+res.data.guess+" the animal you were thinking of?",
                    autoStart: true,
                    loop: false,
                    delay: 50,
                });
                setAkinatorGuessMade(true);
                setAkinatorCount(akinatorCount + 1);
            }
            else if (res.data.question) {
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p id="typewriter_${akinatorCount}${randomString}"></p>
                </div>`;
                new Typewriter(`#typewriter_${akinatorCount}${randomString}`, {
                    strings: res.data.question,
                    autoStart: true,
                    loop: false,
                    delay: 50,
                });
                // Increment the count
                setAkinatorCount(akinatorCount + 1);
            }
            else {
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p id="typewriter_${akinatorCount}${randomString}"></p>
                </div>`;
                new Typewriter(`#typewriter_${akinatorCount}${randomString}`, {
                    strings: res.data,
                    autoStart: true,
                    loop: false,
                    delay: 50,
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    function generateRandomString(length, characterSet) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            result += characterSet[randomIndex];
        }
        return result;
    }

    const checkName = (name) => {
        if (name === "" || name === null || name.length < 3) {
            return false;
        }
        return true;
    }

    const checkEmail = (email) => {
        if (email === "" || email === null || email.length < 3 || !email.includes("@") || !email.includes(".")) {
            return false;
        }
        return true;
    }

    const sendMessage = async (e) => {
        if (message === "" || message === null) {
            return;
        }
        setSpinner(true);
        e.preventDefault();
        document.getElementById("input-chat").value = "";
        document.getElementById("msg-box").innerHTML += `
        <div class="user-msg">
        <p>${message}</p>
        <img src=${auth.currentUser.photoURL} alt="profile" class="userimg"/>
        </div>`;
        const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomString = generateRandomString(10, characterSet);
        var element = document.getElementById("msg-box");
        element.scrollTop = element.scrollHeight;
        if (message === "/help") {
            document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
            <p>Here are some commands you can use to interact with me.<br>
            <b>/help</b> - To get a list of commands.<br>
            <b>/feedback</b> - To give feedback or report a bug.<br>
            <b>/play</b> - To play the game of Akinator.<br>
            </p>
            </div>`;
            setSpinner(false);
            return;
        }
        if (message === "/feedback") {
            setFeedback(true);
            document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
            <p>Thanks for taking your time to suggest a new feature or report a bug. To proceed, we need some more details from you. <br> What is your Name?</p>
            </div>`;
            setSpinner(false);
            return;
        }
        if (feedback) {
            if (feedbackName === "") {
                if (checkName(message)) {
                    setFeedbackName(message);
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>What is your email?</p>
                </div>`;
                }
                else {
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Enter a valid name!</p>
                </div>`;
                }
                setSpinner(false);
                return;
            }
            if (feedbackEmail === "") {
                if (checkEmail(message)) {
                    setFeedbackEmail(message);
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>What is your feedback type?(bug/feature)</p>
                </div>`;
                }
                else {
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Enter a valid email!</p>
                </div>`;
                }
                setSpinner(false);
                return;
            }
            if (feedbackType === "") {
                if (message === "bug" || message === "feature") {
                    setFeedbackType(message);
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Give a detailed explanation about the suggested feature or the bug found</p>
                </div>`;
                }
                else {
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Enter a valid feedback type!</p>
                </div>`;
                }
                setSpinner(false);
                return;
            }
            if (feedbackMessage === "") {
                setFeedbackMessage(message);
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Can you fix this bug or add this feature yourself? (yes/no)</p>
                </div>`;
                setSpinner(false);
                return;
            }
            if (selfFixable === "") {
                if (message === "yes" || message === "no") {
                    setSelfFixable(message);
                    if (message === "yes") {
                        document.getElementById("msg-box").innerHTML += `
                        <div class="bot-msg">
                        <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                        <p>Enter your GitHub username</p>
                        </div>`;
                        setSpinner(false);
                        return;
                    }
                    else {
                        document.getElementById("msg-box").innerHTML += `
                        <div class="bot-msg">
                        <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                        <p>Thanks for your feedback!</p>
                        </div>`;
                        console.log("User refused to fix...Details are as follows: ", feedbackName, feedbackEmail, feedbackType, feedbackMessage, selfFixable);
                        let issueObj = {
                            name: feedbackName,
                            email: feedbackEmail,
                            type: feedbackType,
                            message: feedbackMessage,
                        }
                        setFeedbackName("");
                        setFeedbackEmail("");
                        setFeedbackType("");
                        setFeedbackMessage("");
                        setSelfFixable("");
                        setFeedback(false);
                        setGithubID("");
                        setSpinner(false);
                        await axios.post("http://localhost:3000/application/issue", issueObj);
                        return;
                    }
                }
                else {
                    document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Enter a valid answer!</p>
                </div>`;
                }
                setSpinner(false);
                return;
            }
            if (selfFixable === "yes") {
                if (githubID === "") {
                    await setGithubID(message);
                    document.getElementById("msg-box").innerHTML += `
                    <div class="bot-msg">
                    <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                    <p>Thanks for your feedback!</p>
                    </div>`;
                    console.log("Details are as follows: ", feedbackName, feedbackEmail, feedbackType, feedbackMessage, selfFixable, githubID);
                    let assigneeObj = {
                        userName: feedbackName,
                        email: feedbackEmail,
                        type: feedbackType,
                        message: feedbackMessage,
                        githubID: message
                    }
                    setFeedbackName("");
                    setFeedbackEmail("");
                    setFeedbackType("");
                    setFeedbackMessage("");
                    setSelfFixable("");
                    setFeedback(false);
                    setGithubID("");
                    let res = await axios.post("http://localhost:3000/application/issue/assignee", assigneeObj);
                    res ? console.log(res) : console.log("Error");
                    setSpinner(false);
                    return;
                }
            }
        }
        if (message === "/play") {
            document.getElementById("msg-box").innerHTML += `
            <div class="bot-msg">
            <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
            <p>Welcome to the game of <strong>Akinator</strong>!<br> I will try to guess the <strong>Animal</strong> you are thinking of in a maximum of 20 questions.<br> Enter "yes" or "no" to answer my questions. Enter "quit" to exit the game.<br>Enter <strong>/start</strong> to start playing.</p>
            </div>`;
            setAkinator(true);
            setSpinner(false);
            return;
        }
        if (akinator) {
            if (message === "quit") {
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Thanks for playing!</p>
                </div>`;
                setAkinator(false);
                setAkinatorStarted(false);
                setAkinatorGuessMade(false);
                setAkinatorCount(0);
                setSpinner(false);
                return;
            }
            if (message === "/start") {
                await startAkinator(randomString);
                setAkinatorStarted(true);
                setSpinner(false);
                return;
            }
            if (akinatorStarted && akinatorCount < 20) {
                if(akinatorGuessMade && message === "yes") {
                    document.getElementById("msg-box").innerHTML += `
                    <div class="bot-msg">
                    <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                    <p>Yayy! I am right! I guessed your animal in <strong>${akinatorCount}</strong> questions. To play again, use the <strong>/play</strong> command.</p>
                    </div>`;
                    setAkinator(false);
                    setAkinatorStarted(false);
                    setAkinatorGuessMade(false);
                    setAkinatorCount(0);
                    setSpinner(false);
                    return;
                }
                else if(akinatorGuessMade && message === "no") {
                    document.getElementById("msg-box").innerHTML += `
                    <div class="bot-msg">
                    <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                    <p>Oops! I was wrong. I will try again. Enter <strong>/play</strong> to play again</p>
                    </div>`;
                    setAkinator(false);
                    setAkinatorStarted(false);
                    setAkinatorGuessMade(false);
                    setAkinatorCount(0);
                    setSpinner(false);
                    return;
                }
                else if (message === "yes" || message === "no") {
                    await akinatorGuess(message, randomString);
                    setSpinner(false);
                    return;
                }
                else {
                    document.getElementById("msg-box").innerHTML += `
                    <div class="bot-msg">
                    <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                    <p>Enter a valid answer!</p>
                    </div>`;
                }
                setSpinner(false);
                return;
            }
            else if(akinatorCount >= 20) {
                document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src=https://cdn-icons-png.flaticon.com/512/4944/4944377.png alt="profile" class="userimg"/>
                <p>Oops! I have used up all my questions. I will try again. Enter <strong>/play</strong> to play again</p>
                </div>`;
                setAkinator(false);
                setAkinatorStarted(false);
                setAkinatorGuessMade(false);
                setAkinatorCount(0);
                setSpinner(false);
                return;
            }
        }
        await sendApiRequest(message, randomString);
    }

    const ClearHistory = () => {
        const divs = document.getElementById('msg-box');
        const ele = divs.getElementsByTagName('div');
        while (divs.firstChild) {
            divs.removeChild(divs.firstChild);
        }
        if (ele.length === 0) {
            document.getElementById("msg-box").innerHTML += `
                <div class="bot-msg">
                <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" class="userimg"/>
                <p>Hi <strong>${auth.currentUser.displayName}</strong>. Enter prompt to get answers...</p>
                </div>`;
        }
        setSample(false);
    }

    const OnscreenQuestion = (e) => {
        RemovePlaceholder();
        var data = e.target.getAttribute("value");
        setMessage(data);
        document.getElementById("input-chat").value = data;
        const divs = document.getElementById('msg-box');
        const ele = divs.getElementsByTagName('div');
        setSample(false);
    }


    return (
        <div className="Profile">
            <div className="Navbar">
                <div className="NavLeft">
                    {auth.currentUser.photoURL == null ? (<img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="logo" style={{ padding: "5px", borderRadius: "50%", outline: "solid black" }} height="40px" width="40px" />) : (<img src={auth.currentUser.photoURL} alt="profile" height="50px" width="50px" style={{ marginRight: "5px", marginBottom: "10px", borderRadius: "50%", outline: "solid black" }} />)}
                    <h3 className="username">{auth.currentUser.displayName}</h3>
                </div>
                <div className="NavRight">
                    <button className="logout-btn"
                        onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
            <hr></hr>
            <div className="ChatBot">
                <div className="ChatBot-Header">
                    <h3>ChatBot</h3>
                </div>
                <div className="chatbot-body">
                    <div className="Message-Container" id="msg-box">
                        <div className="bot-msg">
                            <img src="https://cdn-icons-png.flaticon.com/512/4944/4944377.png" alt="profile" className="userimg" />
                            <p>Hi <strong>{auth.currentUser.displayName}</strong>. Enter prompt to get answers...</p>
                        </div>
                        {sample ? (
                            <div className="grid-container">
                                <div className="grid-item" value="Explain quantum computing in simple terms" onClick={(e) => { OnscreenQuestion(e); }}>"Explain quantum computing in simple terms" →</div>
                                <div className="grid-item" value="Got any creative ideas for a 10 year old’s birthday?" onClick={(e) => { OnscreenQuestion(e); }}>"Got any creative ideas for a 10 year old’s birthday?" →</div>
                                <div className="grid-item" value="How do I make an HTTP request in Javascript?" onClick={(e) => { OnscreenQuestion(e); }}>"How do I make an HTTP request in Javascript?" →</div>
                                <div className="grid-item" value="Explain quantum computing in simple terms" onClick={(e) => { OnscreenQuestion(e); }}>"Explain quantum computing in simple terms" →</div>
                                <div className="grid-item" value="Got any creative ideas for a 10 year old’s birthday?" onClick={(e) => { OnscreenQuestion(e); }}>"Got any creative ideas for a 10 year old’s birthday?" →</div>
                                <div className="grid-item" value="How do I make an HTTP request in Javascript?" onClick={(e) => { OnscreenQuestion(e); }}>"How do I make an HTTP request in Javascript?" →</div>
                            </div>
                        ) : (<div></div>)}
                    </div>
                    <div className="chatbot-body-bottom" id="chating">
                        <TextAnimation.Slide target="prompt" id="animeplaceholder" text={['Day', 'Questions', 'Answers']}>
                            Search for a prompt
                        </TextAnimation.Slide>
                        <textarea placeholder="" className="chatbot-input" id="input-chat" onChange={
                            (e) => {
                                setMessage(e.target.value);
                                RemovePlaceholder();
                            }
                        } >
                        </textarea>
                        <div className="Button-Container">
                            <ImBin className="chatbot-attach-btn" onClick={() => { ClearHistory() }} />
                            {spinner === true ? <div className="spinner"></div> : <GrSend className="chatbot-send-btn" onClick={
                                async (e) => {
                                    await setSample(false);
                                    sendMessage(e);
                                }
                            } />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="FeedbackMessage">
                <h2>To get details about the special commands that are supported, use /help command...</h2>
            </div>
        </div>
    )
}

export default Profile;
