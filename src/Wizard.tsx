import {
  useAuth,
} from '@clerk/clerk-react';
import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { createClient } from '@supabase/supabase-js'

// CSS styles for screenshot-like appearance
const screenshotStyles = `
  .screenshot-container {
    position: relative;
    display: inline-block;
    margin: 20px 0;
    border-radius: 16px;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    padding: 12px;
    padding-top: 48px;
    border: 1px solid #e1e5e9;
    max-width: 90%;
  }
  
  .screenshot-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 36px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid #dee2e6;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  
  .screenshot-container::after {
    content: '●●●';
    position: absolute;
    top: 10px;
    left: 18px;
    color: #6c757d;
    font-size: 14px;
    letter-spacing: 3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .screenshot-image {
    border-radius: 8px;
    max-width: 100%;
    height: auto;
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 0;
  }
  
  .screenshot-container:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .screenshot-caption {
    font-style: italic;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .screenshot-caption:hover {
    opacity: 1;
  }
`;

// URL validation function
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Step 1: Enable Data API
function EnableDataAPIStep() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mb-3">
      <h4>Enable Data API</h4>
      <ol>
        <li>Go to the "Data API" tab</li>
        <li>Choose "Other Provider" for the authentication provider.</li>
        <li>
        <div className="mb-3">
          <div className="row align-items-center">
            <div className="col-md-3">
              <Form.Label className="mb-0">Use this URL for the JWKS:</Form.Label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                <Form.Control 
                  type="text" 
                  value="https://climbing-minnow-11.clerk.accounts.dev/.well-known/jwks.json" 
                  readOnly 
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => copyToClipboard("https://climbing-minnow-11.clerk.accounts.dev/.well-known/jwks.json")}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
        </li>

        <li>
        <div className="mb-3">
          <div className="row align-items-center">
            <div className="col-md-3">
              <Form.Label className="mb-0">Set JWT audience to:</Form.Label>
            </div>
            <div className="col-md-9">
              <div className="input-group">
                <Form.Control 
                  type="text" 
                  value="authenticated" 
                  readOnly 
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => copyToClipboard("authenticated")}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
        </li>

        <li>
        <p>Click Enable</p>
        </li>
      </ol>
      <div className="text-center">
        <div className="screenshot-container">
          <img 
            src="/enable-data-api.png" 
            alt="Enable Data API Configuration" 
            className="img-fluid screenshot-image"
          />
        </div>
        <p className="screenshot-caption text-muted mt-2">
          <small>📱 Reference: This is how your Neon dashboard should look</small>
        </p>
      </div>
    </div>
  );
}

// Step 2: Add Sample Table and Data with Permissions
function SampleTableAndPermissionsStep() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const combinedSQL = `-- Create a sample users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO users (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com');

-- Grant permissions to the authenticated role for the users table
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO authenticated;

-- RLS policy for authenticated users (covers all operations)
CREATE POLICY "Allow authenticated users full access"
ON users FOR ALL USING (true) WITH CHECK (true);`;

  return (
    <div className="mb-3">
      <h4>Add Sample Table and Data with Permissions</h4>
      <ol>
        <li>Go to the "SQL Editor" tab</li>
        <li>Paste the combined SQL into the editor and click "Run"</li>
      </ol>
      
      <div className="mb-3">
        <Form.Label>Combined SQL (Table Creation, Data, and Permissions):</Form.Label>
        <div className="input-group">
          <Form.Control 
            as="textarea" 
            rows={25}
            value={combinedSQL} 
            readOnly 
            style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
          />
          <Button 
            variant="outline-secondary" 
            onClick={() => copyToClipboard(combinedSQL)}
          >
            Copy
          </Button>
        </div>
      </div>
      
      <p className="text-muted">
        <small>This will create a simple users table with sample data and grant the necessary permissions to the 'authenticated' role so your Data API can access the tables.</small>
      </p>
    </div>
  );
}

// Step 3: Configure the API
function ConfigureAPIStep({ endpointUrl, setEndpointUrl, onError, onSuccess }: {
  endpointUrl: string;
  setEndpointUrl: (url: string) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}) {
  const handleCheck = async () => {

    // check for now only that the url is valid
    // if (!isValidUrl(endpointUrl)) {
    //   onError('Invalid URL. Please enter a valid URL.');
    //   return;
    // }
    // onSuccess('URL is valid. You can now try the API.');
    // by now teh neon client should be available in the global scope
    const client = (window as any).neon;
    if (client) {
       const { data, error } = await client.from('users').select('*');
       console.log(data, error);
       if (error) {
        onError(`Error fetching data: ${error.message || 'Unknown error occurred'}`);
       } else {
        onSuccess(`Successfully fetched ${data?.length || 0} users from the database`);
       }
    } else {
      onError('Neon client is not available. Please make sure you have entered a valid endpoint URL.');
    }
  };

  const isUrlValid = endpointUrl === '' || isValidUrl(endpointUrl);

  return (
    <div className="mb-3">
      <h4>Configure the API</h4>
      <ol>
        <li>Go to the "Data API" tab</li>
        <li>Copy the "REST API Endpoint" and paste it into the form below</li>
        <li>Click "Check"</li>
      </ol>
      
      <div className="mb-3">
        <Form.Label>REST API Endpoint:</Form.Label>
        <div className="input-group">
          <Form.Control 
            type="text" 
            placeholder="https://your-endpoint-url.com/api" 
            value={endpointUrl} 
            onChange={(e) => setEndpointUrl(e.target.value)}
            style={{ 
              borderColor: isUrlValid ? '' : '#dc3545',
              borderWidth: isUrlValid ? '' : '2px'
            }}
          />
          <Button 
            variant="primary" 
            onClick={handleCheck}
          >
            Check
          </Button>
        </div>
        {!isUrlValid && (
          <div className="text-danger mt-1">
            <small>Please enter a valid URL</small>
          </div>
        )}
      </div>
      
      <p className="text-muted">
        <small>Enter your Data API endpoint URL and click Check to test the connection.</small>
      </p>

      <div className="text-center">
        <div className="screenshot-container">
          <img 
            src="/test-data-api.png" 
            alt="Test Data API Configuration" 
            className="img-fluid screenshot-image"
          />
        </div>
        <p className="screenshot-caption text-muted mt-2">
          <small>📱 Reference: This is how your Data API configuration should look</small>
        </p>
      </div>
    </div>
  );
}

// Step 4: Try the API
function TryAPIStep({ endpointUrl, setEndpointUrl, token }: {
  endpointUrl: string;
  setEndpointUrl: (url: string) => void;
  token: string;
}) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [activeTab, setActiveTab] = useState<'browser' | 'terminal'>('browser');

  const isUrlValid = endpointUrl === '' || isValidUrl(endpointUrl);

  return (
    <div className="mb-3">
      <h4>Try the API</h4>
      <p>Current configuration:</p>
      
      <div className="row">
        <div className="col-md-6">
          <Form.Label>Endpoint URL:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="https://your-endpoint-url.com/api" 
            value={endpointUrl} 
            onChange={(e) => setEndpointUrl(e.target.value)}
            style={{ 
              borderColor: isUrlValid ? '' : '#dc3545',
              borderWidth: isUrlValid ? '' : '2px'
            }}
          />
          {!isUrlValid && (
            <div className="text-danger mt-1">
              <small>Please enter a valid URL</small>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <Form.Label>JWT Token:</Form.Label>
          <div className="input-group">
            <Form.Control 
              type="text" 
              value={token} 
              readOnly 
            />
            <Button 
              variant="outline-secondary" 
              onClick={() => copyToClipboard(token)}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-4">
        <ul className="nav nav-tabs" id="apiTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'browser' ? 'active' : ''}`}
              onClick={() => setActiveTab('browser')}
              type="button"
              role="tab"
            >
              Browser Console with SDK
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'terminal' ? 'active' : ''}`}
              onClick={() => setActiveTab('terminal')}
              type="button"
              role="tab"
            >
              Terminal with curl
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mt-3" id="apiTabContent">
          {/* Browser Console Tab */}
          <div className={`tab-pane fade ${activeTab === 'browser' ? 'show active' : ''}`} role="tabpanel">
            <div className="mb-3">
              <h6>Instructions:</h6>
              <ol>
                <li>Open the developer tools in this browser (F12)</li>
                <li>Go to the console tab</li>
                <li>Try the following commands (each line individually):</li>
              </ol>
            </div>
            
            {[
              "await neon.from('users').select('id')",
              "await neon.from('users').select('*').eq('id', 1)",
              "await neon.from('users').select('*')"
            ].map((command, index) => (
              <div key={index} className="mb-3">
                <div className="input-group">
                  <Form.Control 
                    type="text" 
                    value={command}
                    readOnly 
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => copyToClipboard(command)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Tab */}
          <div className={`tab-pane fade ${activeTab === 'terminal' ? 'show active' : ''}`} role="tabpanel">
            <div className="mb-3">
              <h6>Instructions:</h6>
              <p>Run the following commands in a terminal:</p>
            </div>
            
            {[
              `export ENDPOINT_URL="${endpointUrl}"`,
              `export NEON_JWT="${token}"`,
              `curl -i -H "Authorization: Bearer $NEON_JWT" "$ENDPOINT_URL/users?select=id"`,
              `curl -i -H "Authorization: Bearer $NEON_JWT" "$ENDPOINT_URL/users?select=*&id=eq.1"`,
              `curl -i -H "Authorization: Bearer $NEON_JWT" "$ENDPOINT_URL/users?select=*"`
            ].map((command, index) => (
              <div key={index} className="mb-3">
                <div className="input-group">
                  <Form.Control 
                    type="text" 
                    value={command}
                    readOnly 
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => copyToClipboard(command)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Wizard() {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string>();
  const [endpointUrl, setEndpointUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Inject screenshot styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = screenshotStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  

  const refreshJWT = useCallback(() => {
    getToken({ template: "neon" }).then((token) => {
      if (token) {
        setToken(token);
        
        // Parse the JWT to get expiration time
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expTime = payload.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();
          const timeUntilExpiry = expTime - currentTime;
          const refreshTime = timeUntilExpiry - (60 * 1000); // 1 minute before expiry
          
          // Set up auto-refresh timer
          if (refreshTime > 0) {
            setTimeout(() => {
              setSuccess('Auto-refreshing JWT token...');
              refreshJWT();
            }, refreshTime);
          }
        } catch (error) {
          setError('Error parsing JWT token. Please refresh the page.');
        }
      }
    }).catch((error) => {
      setError(`Failed to get JWT token: ${error.message || 'Unknown error occurred'}`);
    });
  }, [setToken, getToken, setError, setSuccess]);

  useEffect(() => {
    refreshJWT();
  }, [refreshJWT]);

  useEffect(() => {
    
    if (endpointUrl != '' && isValidUrl(endpointUrl)) {
      setError(null);
      setSuccess(null);
      const publicKey = 'dummy-key';
      // strip /rest/v1 from the endpointUrl
      const endpointUrlWithoutRest = endpointUrl.replace('/rest/v1', '');
      const client = createClient(endpointUrlWithoutRest, publicKey, {
        accessToken: async () => {
          return token||null;
        },
      });
      // add the client to the global scope
      (window as any).neon = client;
    }
  }, [token, endpointUrl, setError, setSuccess]);

  const nextStep = () => {
    setError(null);
    setSuccess(null);
    setCurrentStep(prev => Math.min(prev + 1, 3)); // Now 4 steps (0-3)
  };

  const prevStep = () => {
    setError(null);
    setSuccess(null);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <EnableDataAPIStep />;
      case 1:
        return <SampleTableAndPermissionsStep />;
      case 2:
        return <ConfigureAPIStep endpointUrl={endpointUrl} setEndpointUrl={setEndpointUrl} onError={setError} onSuccess={setSuccess} />;
      case 3:
        return <TryAPIStep endpointUrl={endpointUrl} setEndpointUrl={setEndpointUrl} token={token || ''} />;
      default:
        return null;
    }
  };

  return <div> 
    {/* Wizard Navigation */}
    <div className="d-flex justify-content-between mb-4 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
      <Button 
        variant="outline-secondary" 
        onClick={prevStep}
        disabled={currentStep === 0}
      >
        ← Back
      </Button>
      
      <div className="text-muted">
        Step {currentStep + 1} of 4
      </div>
      
      <Button 
        variant="primary" 
        onClick={nextStep}
        disabled={currentStep === 3}
      >
        Next →
      </Button>
    </div>

    {/* Error and Success Messages */}
    {error && (
      <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )}
    
    {success && (
      <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-3">
        <Alert.Heading>Success</Alert.Heading>
        <p>{success}</p>
      </Alert>
    )}

    {/* Form Content */}
    <div className="wizard-content">
      {renderStep()}
    </div>

    {/* {resp && <JSONTree data={resp} />} */}
  </div>;
}

export default Wizard;
