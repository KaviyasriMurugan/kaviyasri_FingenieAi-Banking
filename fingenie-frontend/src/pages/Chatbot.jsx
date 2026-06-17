  import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
 
const getBotReply = (message) => {
    const msg = message.toLowerCase();
 
    if (msg.includes('complaint') || msg.includes('urgent') ||
            msg.includes('problem') || msg.includes('issue') ||
            msg.includes('not working') || msg.includes('stuck') ||
            msg.includes('error')) {
        return 'I understand you are facing an issue! Escalating to support team.\n\nEscalation Details:\n- Priority: HIGH\n- Status: Escalated to Human Agent\n- Ticket ID: TKT' + Math.floor(Math.random() * 100000) + '\n\nSupport team will contact you within 2 hours!\nToll Free: 1800-FIN-GENIE';
    }
 
    if (msg.includes('block') || msg.includes('stolen') ||
            msg.includes('unauthorized') || msg.includes('hack')) {
        return 'URGENT SECURITY ALERT!\n\nImmediate actions:\n1. Account monitoring activated\n2. Suspicious activity flagged\n3. Security team notified\n\nTicket ID: SEC' + Math.floor(Math.random() * 100000) + '\n\nCall: 1800-FIN-SECURE\nAvailable 24x7!';
    }
 
    if (msg.includes('refund') || msg.includes('wrong amount') ||
            msg.includes('deducted') || msg.includes('failed transaction')) {
        return 'Transaction dispute raised!\n\nDispute Details:\n- Status: Under Review\n- Ticket ID: DSP' + Math.floor(Math.random() * 100000) + '\n- Resolution: 3-5 business days\n\nTeam will investigate and resolve!';
    }
 
    if (msg.includes('loan') && msg.includes('apply'))
        return 'To apply for a loan in FinGenie, go to Loans page, fill loan amount, tenure, income, enter credit score and click Apply Now. Our AI will predict approval instantly!';
 
    if (msg.includes('loan'))
        return 'FinGenie offers AI powered loan approval prediction! Home Loans, Personal Loans, Business Loans available. Credit score above 750 improves approval chances!';
 
    if (msg.includes('emi'))
        return 'EMI is calculated as Principal multiplied by Rate. Use our EMI Calculator in the Loans section to calculate instantly!';
 
    if (msg.includes('invest') || msg.includes('mutual fund'))
        return 'Smart Investment Tips:\n- Low Risk: FD and Government Bonds\n- Medium Risk: Balanced Mutual Funds\n- High Risk: Equity Funds and Stocks\nDiversify your portfolio for best returns!';
 
    if (msg.includes('fraud') || msg.includes('suspicious'))
        return 'Fraud Prevention Tips:\n- Never share OTP with anyone\n- Check transaction risk scores\n- Report suspicious activity immediately\n- Use FinGenie Fraud Alerts page!';
 
    if (msg.includes('deposit'))
        return 'To deposit money, go to Dashboard, enter amount and click Deposit button. Your balance updates instantly!';
 
    if (msg.includes('withdraw'))
        return 'To withdraw money, go to Dashboard, enter amount and click Withdraw button. Make sure you have sufficient balance!';
 
    if (msg.includes('transfer'))
        return 'To transfer money, go to Dashboard, enter amount and recipient account number starting with FG, then click Transfer button!';
 
    if (msg.includes('balance'))
        return 'Your account balance is shown on the Dashboard. Account number starts with FG followed by 10 digits.';
 
    if (msg.includes('credit score'))
        return 'Credit Score Guide:\n- 750 and above: Excellent\n- 650 to 750: Good\n- 550 to 650: Average\n- Below 550: Poor\nPay bills on time to improve your score!';
 
    if (msg.includes('interest'))
        return 'Current Interest Rates:\n- Home Loan: 8.5 to 10 percent\n- Personal Loan: 12 to 18 percent\n- Car Loan: 9 to 12 percent\n- Education Loan: 8 to 11 percent';
 
    if (msg.includes('saving'))
        return 'Savings Account Benefits:\n- Earn interest on deposits\n- Easy withdrawals\n- Safe and secure\n- Typical interest 3 to 7 percent per annum';
 
    if (msg.includes('hello') || msg.includes('hi') ||
            msg.includes('hey'))
        return 'Hello! I am FinGenie AI Assistant! I can help you with Loans, Investments, Fraud Detection, and Banking Operations. What would you like to know?';
 
    if (msg.includes('thank'))
        return 'You are welcome! Is there anything else I can help you with?';
 
    if (msg.includes('otp') || msg.includes('mfa'))
        return 'MFA adds extra security. After login you receive an OTP which must be verified before accessing your account!';
 
    if (msg.includes('qr') || msg.includes('qr code'))
        return 'To receive payments via QR, go to Dashboard and click Show QR Code button. Share the QR code with the sender!';
 
    if (msg.includes('password') || msg.includes('security'))
        return 'Security Tips:\n- Use strong passwords\n- Enable MFA on your account\n- Never share your OTP\n- Log out after every session';
 
    if (msg.includes('account'))
        return 'Your FinGenie account includes a savings account with unique FG number, real time balance tracking, transaction history, and AI fraud monitoring!';
 
    if (msg.includes('help'))
        return 'I can help you with:\n- Loan eligibility and EMI\n- Investment advice\n- Fraud detection\n- Account balance\n- Credit score\n- Interest rates\n- QR payments\nJust ask me anything!';
    if (msg.includes('I am'))
        return 'how can I help you';
    if(msg.includes('ok','bye','sure','fine'))
        return  'thankyou! comeback whenever you want help';
    if(msg.includes('thankyou'))
        return 'you are welcome!';
    return 'I can help you with banking questions! Try asking about Loans, Investments, EMI Calculator, Fraud Alerts, Credit Score, Interest Rates, or Account Balance.';
};
 
const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I am FinGenie AI Banking Assistant. Ask me about loans, investments, fraud detection, or any banking question! You can also use voice input by clicking the Voice button!' }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);
 
    useEffect(() => {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;
 
    if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
 
        recognition.onstart = () => {
            console.log('Voice started');
            setIsListening(true);
        };
 
        recognition.onresult = (event) => {
            const transcript =
                event.results[0][0].transcript;
            console.log('Voice result:', transcript);
            setIsListening(false);
            const botReply = getBotReply(transcript);
            setMessages(prev => [
                ...prev,
                { role: 'user', text: transcript },
                { role: 'bot', text: botReply }
            ]);
            speakResponse(botReply);
        };
 
        recognition.onerror = (event) => {
            console.log('Voice error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('Please allow microphone access in browser settings!');
            }
        };
 
        recognition.onend = () => {
            console.log('Voice ended');
            setIsListening(false);
        };
 
        recognitionRef.current = recognition;
    } else {
        setVoiceSupported(false);
        console.log('Speech recognition not supported');
    }
}, []);
 
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            { behavior: 'smooth' });
    }, [messages]);
 
    const startListening = () => {
    if (recognitionRef.current && !isListening) {
        try {
            recognitionRef.current.abort();
            setTimeout(() => {
                recognitionRef.current.start();
                setIsListening(true);
            }, 100);
        } catch (e) {
            console.log('Start error:', e);
            setIsListening(false);
        }
    }
};
 
 
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };
 
    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance =
                new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };
 
    const sendMessage = () => {
        if (!input.trim()) return;
        const userText = input;
        const botReply = getBotReply(userText);
        setMessages(prev => [
            ...prev,
            { role: 'user', text: userText },
            { role: 'bot', text: botReply }
        ]);
        setInput('');
        speakResponse(botReply);
    };
 
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h1 style={styles.logo}>FinGenie AI</h1>
                <button style={styles.backBtn}
                    onClick={() => navigate('/dashboard')}>
                    Back
                </button>
            </nav>
 
            <div style={styles.chatContainer}>
                <div style={styles.chatHeader}>
                    <div>
                        <h3 style={{ margin: 0 }}>
                             ✨FinGenie Banking Assistant
                        </h3>
                        <p style={{
                            margin: 0, fontSize: '12px',
                            opacity: 0.7
                        }}>
                            AI Powered Banking Support with Voice
                        </p>
                    </div>
                    {voiceSupported && (
                        <div style={styles.voiceStatus}>
                            {isListening ?
                                'Listening...' : 'Voice Ready'}
                        </div>
                    )}
                </div>
 
                <div style={styles.messagesBox}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user'
                                ? 'flex-end' : 'flex-start',
                            marginBottom: '12px'
                        }}>
                            <div style={msg.role === 'user'
                                ? styles.userBubble
                                : styles.botBubble}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
 
                {isListening && (
                    <div style={styles.listeningBar}>
                        Listening... Speak now!
                    </div>
                )}
                <div style={styles.inputRow}>
                    {voiceSupported && (
                        <button
                            style={isListening ?
                                styles.voiceBtnActive :
                                styles.voiceBtn}
                            onClick={isListening ?
                                stopListening : startListening}>
                            {isListening ? 'Stop' : 'Voice'}
                        </button>
                    )}
                    <input
                        style={styles.input}
                        placeholder="Ask about banking or click Voice..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e =>
                            e.key === 'Enter' && sendMessage()}
                    />
                    <button style={styles.sendBtn}
                        onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
 
const styles = {
    container: { minHeight: '100vh', background: '#f0f2f5' },
    nav: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
    },
    logo: { color: 'white', margin: 0 },
    backBtn: {
        background: 'rgba(255,255,255,0.2)', color: 'white',
        border: 'none', padding: '8px 16px',
        borderRadius: '8px', cursor: 'pointer',
    },
    chatContainer: {
        maxWidth: '700px', margin: '32px auto',
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
    },
    chatHeader: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 24px', display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
    },
    voiceStatus: {
        background: 'rgba(255,255,255,0.2)',
        padding: '6px 12px', borderRadius: '12px',
        fontSize: '12px', fontWeight: '600',
    },
    messagesBox: {
        height: '400px', overflowY: 'auto',
        padding: '24px', background: '#f9f9f9',
    },
    userBubble: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', padding: '12px 16px',
        borderRadius: '16px 16px 4px 16px',
        maxWidth: '70%', fontSize: '14px',
        lineHeight: '1.6', whiteSpace: 'pre-wrap',
    },
    botBubble: {
        background: 'white', color: '#333',
        padding: '12px 16px',
        borderRadius: '16px 16px 16px 4px',
        maxWidth: '70%', fontSize: '14px',
        lineHeight: '1.6', whiteSpace: 'pre-wrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    listeningBar: {
        background: '#ff4757', color: 'white',
        padding: '8px', textAlign: 'center',
        fontSize: '14px', fontWeight: '600',
    },
    inputRow: {
        display: 'flex', gap: '8px',
        padding: '16px 24px',
        borderTop: '1px solid #f0f0f0',
        background: 'white',
    },
    voiceBtn: {
        padding: '12px 16px',
        background: '#667eea',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', fontSize: '14px',
    },
    voiceBtnActive: {
        padding: '12px 16px',
        background: '#ff4757',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', fontSize: '14px',
    },
    input: {
        flex: 1, padding: '12px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '14px', outline: 'none',
    },
    sendBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', border: 'none',
        borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600',
    },
};
export default Chatbot