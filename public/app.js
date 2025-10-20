const { useState, useEffect } = React;
const API_BASE = window.location.origin + '/api';

// Router Component
function Router() {
    const [route, setRoute] = useState(window.location.pathname);
    
    useEffect(() => {
        const handlePopState = () => setRoute(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    
    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setRoute(path);
    };
    
    // Route matching
    if (route === '/' || route === '') return <HomePage navigate={navigate} />;
    if (route.startsWith('/intake/')) return <IntakeFlow qrId={route.split('/')[2]} navigate={navigate} />;
    if (route.startsWith('/caseworker/')) return <CaseworkerDashboard caseworkerId={route.split('/')[2]} navigate={navigate} />;
    if (route.startsWith('/municipal')) return <MunicipalDashboard navigate={navigate} />;
    if (route.startsWith('/admin')) return <AdminPanel navigate={navigate} />;
    
    return <NotFound navigate={navigate} />;
}

// Home Page
function HomePage({ navigate }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">🏠 HAVEN</h1>
                    <p className="text-2xl text-gray-600 mb-2">Housing Assistance Via Engaged Network</p>
                    <p className="text-lg text-gray-500">AI-Powered Homeless Services Platform</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
                         onClick={() => navigate('/intake/demo')}>
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-xl font-semibold mb-2">Client Intake</h3>
                        <p className="text-gray-600">Complete your housing assessment</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
                         onClick={() => navigate('/caseworker/demo')}>
                        <div className="text-4xl mb-4">💼</div>
                        <h3 className="text-xl font-semibold mb-2">Caseworkers</h3>
                        <p className="text-gray-600">Manage your caseload</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer"
                         onClick={() => navigate('/municipal')}>
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold mb-2">Municipal</h3>
                        <p className="text-gray-600">Analytics & insights</p>
                    </div>
                </div>
                
                <div className="text-center mt-12">
                    <button onClick={() => navigate('/admin')} 
                            className="text-gray-500 hover:text-gray-700 text-sm">
                        Admin Panel
                    </button>
                </div>
            </div>
        </div>
    );
}

// Intake Flow Component
function IntakeFlow({ qrId, navigate }) {
    const [session, setSession] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [result, setResult] = useState(null);
    
    useEffect(() => {
        startSession();
    }, []);
    
    const startSession = async () => {
        try {
            const res = await fetch(`${API_BASE}/intake/${qrId}/start`);
            const data = await res.json();
            if (data.success) {
                setSession(data);
            }
        } catch (err) {
            console.error('Session start error:', err);
        }
        setLoading(false);
    };
    
    const questions = getIntakeQuestions();
    
    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitIntake();
        }
    };
    
    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };
    
    const submitIntake = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/intake/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: session.session_id,
                    assessment_data: formData
                })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
                setComplete(true);
            }
        } catch (err) {
            console.error('Submission error:', err);
        }
        setSubmitting(false);
    };
    
    if (loading) {
        return <LoadingScreen message="Starting your assessment..." />;
    }
    
    if (!session) {
        return (
            <ErrorScreen 
                message="Invalid or expired QR code" 
                onBack={() => navigate('/')}
            />;
        );
    }
    
    if (complete && result) {
        return <IntakeComplete result={result} navigate={navigate} />;
    }
    
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-xl font-semibold text-gray-900">HAVEN Intake</h1>
                        <span className="text-sm text-gray-500">{currentStep + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
            </div>
            
            {/* Question */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <QuestionRenderer 
                        question={currentQuestion}
                        value={formData[currentQuestion.id]}
                        onChange={(value) => setFormData({...formData, [currentQuestion.id]: value})}
                    />
                </div>
                
                {/* Navigation */}
                <div className="flex gap-4 mt-6">
                    {currentStep > 0 && (
                        <button onClick={handleBack}
                                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                            Back
                        </button>
                    )}
                    <button onClick={handleNext}
                            disabled={!formData[currentQuestion.id] || submitting}
                            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {submitting ? 'Submitting...' : currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function QuestionRenderer({ question, value, onChange }) {
    return (
        <div>
            <label className="block text-lg font-medium text-gray-900 mb-4">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.type === 'text' && (
                <input 
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={question.placeholder}
                />
            )}
            
            {question.type === 'number' && (
                <input 
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            )}
            
            {question.type === 'date' && (
                <input 
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            )}
            
            {question.type === 'email' && (
                <input 
                    type="email"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={question.placeholder}
                />
            )}
            
            {question.type === 'tel' && (
                <input 
                    type="tel"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={question.placeholder}
                />
            )}
            
            {question.type === 'select' && (
                <select 
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select an option</option>
                    {question.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}
            
            {question.type === 'multiselect' && (
                <div className="space-y-2">
                    {question.options.map(opt => (
                        <label key={opt.value} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input 
                                type="checkbox"
                                checked={(value || []).includes(opt.value)}
                                onChange={(e) => {
                                    const current = value || [];
                                    if (e.target.checked) {
                                        onChange([...current, opt.value]);
                                    } else {
                                        onChange(current.filter(v => v !== opt.value));
                                    }
                                }}
                                className="mr-3 h-5 w-5 text-blue-600"
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
            
            {question.type === 'textarea' && (
                <textarea 
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={question.placeholder}
                />
            )}
            
            {question.help && (
                <p className="mt-2 text-sm text-gray-500">{question.help}</p>
            )}
        </div>
    );
}

function IntakeComplete({ result, navigate }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                    <p className="text-lg text-gray-600">{result.message}</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Your Caseworker</h2>
                    <div className="space-y-2">
                        <p className="text-gray-700"><strong>Name:</strong> {result.caseworker.name}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {result.caseworker.phone}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {result.caseworker.email}</p>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Your caseworker will contact you within 24 hours</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>They will discuss housing options and create a personalized plan</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Keep your phone nearby so they can reach you</span>
                        </li>
                    </ul>
                </div>
                
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Your Client ID: {result.client_id.substring(0, 8)}</p>
                    <button onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

// Caseworker Dashboard
function CaseworkerDashboard({ caseworkerId, navigate }) {
    const [data, setData] = useState(null);
    const [briefing, setBriefing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('dashboard');
    
    useEffect(() => {
        loadDashboard();
        loadBriefing();
    }, []);
    
    const loadDashboard = async () => {
        try {
            const res = await fetch(`${API_BASE}/caseworker/${caseworkerId}/dashboard`);
            const json = await res.json();
            if (json.success) setData(json);
        } catch (err) {
            console.error('Dashboard load error:', err);
        }
        setLoading(false);
    };
    
    const loadBriefing = async () => {
        try {
            const res = await fetch(`${API_BASE}/caseworker/${caseworkerId}/briefing`);
            const json = await res.json();
            if (json.success) setBriefing(json.briefing);
        } catch (err) {
            console.error('Briefing load error:', err);
        }
    };
    
    if (loading) return <LoadingScreen message="Loading dashboard..." />;
    if (!data) return <ErrorScreen message="Failed to load dashboard" onBack={() => navigate('/')} />;
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.caseworker.name}</h1>
                            <p className="text-gray-600">Caseload: {data.caseworker.current_caseload} / {data.caseworker.max_caseload}</p>
                        </div>
                        <button onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Home
                        </button>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex gap-4 mt-4 border-b border-gray-200">
                        <button onClick={() => setView('dashboard')}
                                className={`pb-2 px-1 border-b-2 transition-colors ${view === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            Dashboard
                        </button>
                        <button onClick={() => setView('briefing')}
                                className={`pb-2 px-1 border-b-2 transition-colors ${view === 'briefing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            Daily Briefing
                        </button>
                        <button onClick={() => setView('clients')}
                                className={`pb-2 px-1 border-b-2 transition-colors ${view === 'clients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            Active Clients
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {view === 'dashboard' && <DashboardView data={data} />}
                {view === 'briefing' && <BriefingView briefing={briefing} />}
                {view === 'clients' && <ClientsView clients={data.assignments} />}
            </div>
        </div>
    );
}

function DashboardView({ data }) {
    return (
        <div className="grid gap-6">
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-blue-600">{data.caseworker.current_caseload}</div>
                    <div className="text-gray-600">Active Clients</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-green-600">
                        {data.assignments.filter(a => a.priority === 'urgent').length}
                    </div>
                    <div className="text-gray-600">High Priority</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-orange-600">0</div>
                    <div className="text-gray-600">Pending Tasks</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl font-bold text-purple-600">
                        {Math.round((data.caseworker.current_caseload / data.caseworker.max_caseload) * 100)}%
                    </div>
                    <div className="text-gray-600">Capacity</div>
                </div>
            </div>
            
            {/* Recent Clients */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Recent Assignments</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {data.assignments.slice(0, 5).map(client => (
                        <div key={client.id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">{client.first_name} {client.last_name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{client.current_living_situation}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                        client.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                        client.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {client.priority}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">Score: {client.vulnerability_score}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {client.phone && (
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                        📞 Call
                                    </button>
                                )}
                                {client.email && (
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                                        📧 Email
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BriefingView({ briefing }) {
    if (!briefing) return <LoadingScreen message="Generating your daily briefing..." />;
    
    return (
        <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🤖</span>
                <h2 className="text-2xl font-bold">AI Daily Briefing</h2>
            </div>
            <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{briefing}</pre>
            </div>
        </div>
    );
}

function ClientsView({ clients }) {
    const [filter, setFilter] = useState('all');
    
    const filtered = clients.filter(c => {
        if (filter === 'all') return true;
        if (filter === 'urgent') return c.priority === 'urgent';
        if (filter === 'high') return c.priority === 'high';
        return true;
    });
    
    return (
        <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    All ({clients.length})
                </button>
                <button onClick={() => setFilter('urgent')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'urgent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    Urgent ({clients.filter(c => c.priority === 'urgent').length})
                </button>
                <button onClick={() => setFilter('high')}
                        className={`px-4 py-2 rounded-lg font-medium ${filter === 'high' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    High ({clients.filter(c => c.priority === 'high').length})
                </button>
            </div>
            
            {/* Client List */}
            <div className="grid gap-4">
                {filtered.map(client => (
                    <div key={client.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{client.first_name} {client.last_name}</h3>
                                <p className="text-gray-600">{client.current_living_situation}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                client.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                client.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {client.priority}
                            </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <span className="text-sm text-gray-500">Vulnerability Score</span>
                                <p className="font-medium">{client.vulnerability_score}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Risk Level</span>
                                <p className="font-medium">{client.risk_level}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Housing Goal</span>
                                <p className="font-medium">{client.housing_priority}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            {client.phone && (
                                <a href={`tel:${client.phone}`}
                                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    📞 {client.phone}
                                </a>
                            )}
                            {client.email && (
                                <a href={`mailto:${client.email}`}
                                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                                    📧 {client.email}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Municipal Dashboard
function MunicipalDashboard({ navigate }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Municipal Analytics</h1>
                        <button onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Home
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-blue-600">0</div>
                        <div className="text-gray-600">Total Clients</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-gray-600">Housed This Month</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-orange-600">0</div>
                        <div className="text-gray-600">Active Caseworkers</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-3xl font-bold text-purple-600">0 days</div>
                        <div className="text-gray-600">Avg Time to Housing</div>
                    </div>
                </div>
                
                {/* Charts placeholder */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Intake Trends</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                            <p className="text-gray-500">Chart coming soon</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Housing Outcomes</h3>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                            <p className="text-gray-500">Chart coming soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Admin Panel
function AdminPanel({ navigate }) {
    const [qrCode, setQrCode] = useState(null);
    const [generating, setGenerating] = useState(false);
    
    const generateQR = async () => {
        setGenerating(true);
        try {
            const res = await fetch(`${API_BASE}/qr/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: 'Demo Location',
                    campaign_name: 'Demo Campaign'
                })
            });
            const data = await res.json();
            if (data.success) setQrCode(data);
        } catch (err) {
            console.error('QR generation error:', err);
        }
        setGenerating(false);
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                        <button onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Home
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Generate QR Code</h2>
                    <button onClick={generateQR}
                            disabled={generating}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300">
                        {generating ? 'Generating...' : 'Generate New QR Code'}
                    </button>
                    
                    {qrCode && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-2">QR Code: {qrCode.qr_code}</p>
                            <p className="text-sm text-gray-600 mb-4">Intake URL:</p>
                            <a href={qrCode.intake_url} target="_blank" rel="noopener noreferrer"
                               className="text-blue-600 hover:underline break-all">
                                {qrCode.intake_url}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Utility Components
function LoadingScreen({ message }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4">⏳</div>
                <p className="text-lg text-gray-600">{message}</p>
            </div>
        </div>
    );
}

function ErrorScreen({ message, onBack }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-5xl mb-4">❌</div>
                <p className="text-lg text-gray-600 mb-6">{message}</p>
                <button onClick={onBack}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                    Go Back
                </button>
            </div>
        </div>
    );
}

function NotFound({ navigate }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    Go Home
                </button>
            </div>
        </div>
    );
}

// Intake Questions Data
function getIntakeQuestions() {
    return [
        { id: 'q1_first_name', text: 'What is your first name?', type: 'text', required: true, placeholder: 'Enter your first name' },
        { id: 'q2_last_name', text: 'What is your last name?', type: 'text', required: true, placeholder: 'Enter your last name' },
        { id: 'q3_dob', text: 'What is your date of birth?', type: 'date', required: true },
        { id: 'q5_phone', text: 'What is your phone number?', type: 'tel', required: false, placeholder: '(555) 123-4567' },
        { id: 'q6_email', text: 'What is your email address?', type: 'email', required: false, placeholder: 'your.email@example.com' },
        {
            id: 'q7_gender',
            text: 'What is your gender?',
            type: 'select',
            required: true,
            options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'transgender', label: 'Transgender' },
                { value: 'non_binary', label: 'Non-binary' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]
        },
        {
            id: 'q8_race',
            text: 'What is your race? (Select all that apply)',
            type: 'multiselect',
            required: false,
            options: [
                { value: 'white', label: 'White' },
                { value: 'black', label: 'Black or African American' },
                { value: 'asian', label: 'Asian' },
                { value: 'native_american', label: 'American Indian or Alaska Native' },
                { value: 'pacific_islander', label: 'Native Hawaiian or Pacific Islander' },
                { value: 'other', label: 'Other' }
            ]
        },
        {
            id: 'q9_ethnicity',
            text: 'Are you Hispanic or Latino?',
            type: 'select',
            required: false,
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]
        },
        {
            id: 'q10_veteran',
            text: 'Are you a veteran?',
            type: 'select',
            required: true,
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ]
        },
        {
            id: 'q11_current_situation',
            text: 'Where are you sleeping tonight?',
            type: 'select',
            required: true,
            options: [
                { value: 'street', label: 'Street/outdoors' },
                { value: 'car', label: 'Car or vehicle' },
                { value: 'shelter', label: 'Emergency shelter' },
                { value: 'transitional', label: 'Transitional housing' },
                { value: 'temporary', label: 'Staying with friends/family temporarily' },
                { value: 'hotel', label: 'Hotel/motel' },
                { value: 'other', label: 'Other' }
            ]
        },
        { id: 'q12_homeless_start', text: 'When did you first become homeless?', type: 'date', required: true },
        { id: 'q13_times_homeless', text: 'How many times have you been homeless in the past 3 years?', type: 'number', required: true },
        { id: 'q14_total_months', text: 'Total months homeless in the past 3 years?', type: 'number', required: true },
        {
            id: 'q15_chronic_health',
            text: 'Do you have any chronic health conditions?',
            type: 'select',
            required: true,
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'Unsure' }
            ]
        },
        {
            id: 'q16_mental_health',
            text: 'Do you have any mental health conditions?',
            type: 'select',
            required: true,
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'Unsure' }
            ]
        },
        {
            id: 'q17_substance_use',
            text: 'Do you use drugs or alcohol?',
            type: 'select',
            required: true,
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]
        },
        {
            id: 'q34_housing_preference',
            text: 'What type of housing are you looking for?',
            type: 'select',
            required: true,
            options: [
                { value: 'emergency_shelter', label: 'Emergency shelter (temporary)' },
                { value: 'transitional', label: 'Transitional housing (6-24 months)' },
                { value: 'rapid_rehousing', label: 'Rapid rehousing (rental assistance)' },
                { value: 'permanent_supportive', label: 'Permanent supportive housing' },
                { value: 'not_sure', label: 'Not sure' }
            ]
        },
        {
            id: 'q35_barriers',
            text: 'What barriers do you face in finding housing?',
            type: 'multiselect',
            required: false,
            options: [
                { value: 'income', label: 'No income or low income' },
                { value: 'credit', label: 'Poor credit history' },
                { value: 'criminal', label: 'Criminal background' },
                { value: 'eviction', label: 'Previous eviction' },
                { value: 'documents', label: 'Lack of ID or documents' },
                { value: 'disability', label: 'Disability or health issues' },
                { value: 'discrimination', label: 'Discrimination' },
                { value: 'other', label: 'Other' }
            ]
        },
        {
            id: 'q36_timeline',
            text: 'How soon do you need housing?',
            type: 'select',
            required: true,
            options: [
                { value: 'immediate', label: 'Immediately (tonight)' },
                { value: 'this_week', label: 'Within this week' },
                { value: 'this_month', label: 'Within this month' },
                { value: 'flexible', label: 'Flexible timeline' }
            ]
        },
        {
            id: 'q37_additional_info',
            text: 'Is there anything else you would like us to know?',
            type: 'textarea',
            required: false,
            placeholder: 'Share any additional information that might help us assist you better...'
        }
    ];
}

// Render App
ReactDOM.render(<Router />, document.getElementById('root'));