import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter, Select } from '../ui';
import { useChatbot } from '../chatbot';
import { TrustAction } from '../chatbot/TrustIndexCalculator';
import './CompleteProfileForm.css';

interface CompleteProfileFormProps {
  onProfileComplete: () => void;
}

interface ProfileData {
  occupation: string;
  monthlyIncome: string;
  educationLevel: string;
  birthdate: string;
  city: string;
  socialNetworks: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    twitter: boolean;
  };
  interests: string[];
}

interface ProfileErrors {
  occupation?: string;
  monthlyIncome?: string;
  educationLevel?: string;
  birthdate?: string;
  city?: string;
  general?: string;
}

const educationOptions = [
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'universitario', label: 'Universitario' },
  { value: 'postgrado', label: 'Postgrado' },
];

const incomeRanges = [
  { value: 'menos_500', label: 'Menos de $500' },
  { value: '500_1000', label: 'Entre $500 y $1,000' },
  { value: '1000_2000', label: 'Entre $1,000 y $2,000' },
  { value: '2000_3000', label: 'Entre $2,000 y $3,000' },
  { value: 'mas_3000', label: 'Más de $3,000' },
];

const interestOptions = [
  { value: 'ahorro', label: 'Ahorro' },
  { value: 'inversion', label: 'Inversión' },
  { value: 'credito', label: 'Crédito' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'educacion', label: 'Educación financiera' },
  { value: 'emprendimiento', label: 'Emprendimiento' },
];

export const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({ onProfileComplete }) => {
  const [userData, setUserData] = useState<any>(null);
  const { addTrustAction } = useChatbot();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    occupation: '',
    monthlyIncome: '',
    educationLevel: '',
    birthdate: '',
    city: '',
    socialNetworks: {
      facebook: false,
      instagram: false,
      linkedin: false,
      twitter: false,
    },
    interests: [],
  });

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialConnectStep, setSocialConnectStep] = useState<string | null>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {};
    let isValid = true;

    // Validaciones básicas
    if (!profileData.occupation.trim()) {
      newErrors.occupation = 'La ocupación es obligatoria';
      isValid = false;
    }

    if (!profileData.monthlyIncome) {
      newErrors.monthlyIncome = 'El rango de ingresos es obligatorio';
      isValid = false;
    }

    if (!profileData.educationLevel) {
      newErrors.educationLevel = 'El nivel educativo es obligatorio';
      isValid = false;
    }

    // Validar fecha de nacimiento
    if (!profileData.birthdate) {
      newErrors.birthdate = 'La fecha de nacimiento es obligatoria';
      isValid = false;
    } else {
      const birthDate = new Date(profileData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18 || age > 100) {
        newErrors.birthdate = 'Debes ser mayor de 18 años';
        isValid = false;
      }
    }

    if (!profileData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, value],
      });
    } else {
      setProfileData({
        ...profileData,
        interests: profileData.interests.filter(interest => interest !== value),
      });
    }
  };

  const handleSocialNetworkChange = (network: string) => {
    setProfileData({
      ...profileData,
      socialNetworks: {
        ...profileData.socialNetworks,
        [network]: !profileData.socialNetworks[network as keyof typeof profileData.socialNetworks],
      },
    });
  };

  const handleConnectSocial = (network: string) => {
    setSocialConnectStep(network);
    
    // Simulación de conexión a red social
    setTimeout(() => {
      handleSocialNetworkChange(network);
      setSocialConnectStep(null);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulación de llamada a API para actualizar perfil
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar datos del usuario en localStorage
      if (userData) {
        const updatedUser = {
          ...userData,
          profileData,
          profileCompleted: true,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Incrementar el índice de confianza
        addTrustAction(TrustAction.COMPLETE_PROFILE, 'Perfil completado con información adicional');
        
        // Si conectó al menos una red social, dar puntos adicionales
        const connectedNetworks = Object.values(profileData.socialNetworks).filter(Boolean).length;
        if (connectedNetworks > 0) {
          addTrustAction(
            TrustAction.COMPLETE_PROFILE, 
            `Conectó ${connectedNetworks} redes sociales`, 
            connectedNetworks
          );
        }
      }

      // Notificar éxito
      onProfileComplete();
    } catch (error) {
      setErrors({
        general: 'Error al actualizar perfil. Intente nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complete-profile-container">
      <Card variant="elevated">
        <CardHeader 
          title="Completa tu perfil" 
          subheader="Añade información para personalizar tu experiencia y aumentar tu Índice de Confianza" 
        />
        <CardContent>
          <form onSubmit={handleSubmit} className="complete-profile-form">
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="form-section">
              <h3 className="section-title">Información personal</h3>
              
              <div className="form-field">
                <Input
                  label="Ocupación"
                  name="occupation"
                  value={profileData.occupation}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniero, Comerciante, Estudiante"
                  error={!!errors.occupation}
                  helperText={errors.occupation}
                  fullWidth
                />
              </div>
              
              <div className="form-field">
                <Select
                  label="Nivel educativo"
                  name="educationLevel"
                  value={profileData.educationLevel}
                  onChange={handleChange}
                  options={educationOptions}
                  error={!!errors.educationLevel}
                  helperText={errors.educationLevel}
                  fullWidth
                />
              </div>
              
              <div className="form-field">
                <Input
                  label="Fecha de nacimiento"
                  name="birthdate"
                  type="date"
                  value={profileData.birthdate}
                  onChange={handleChange}
                  error={!!errors.birthdate}
                  helperText={errors.birthdate}
                  fullWidth
                />
              </div>
              
              <div className="form-field">
                <Input
                  label="Ciudad de residencia"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  placeholder="Ej: Bogotá, Medellín, Cali"
                  error={!!errors.city}
                  helperText={errors.city}
                  fullWidth
                />
              </div>
              
              <div className="form-field">
                <Select
                  label="Rango de ingresos mensuales"
                  name="monthlyIncome"
                  value={profileData.monthlyIncome}
                  onChange={handleChange}
                  options={incomeRanges}
                  error={!!errors.monthlyIncome}
                  helperText={errors.monthlyIncome}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">Intereses financieros</h3>
              <p className="section-description">Selecciona los temas que te interesan</p>
              
              <div className="interests-container">
                {interestOptions.map(option => (
                  <label key={option.value} className="interest-option">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={profileData.interests.includes(option.value)}
                      onChange={handleInterestChange}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">Conecta tus redes sociales</h3>
              <p className="section-description">Conectar tus redes sociales aumenta tu Índice de Confianza</p>
              
              <div className="social-networks-container">
                <div className="social-network-item">
                  <div className="social-network-info">
                    <div className="social-icon facebook">f</div>
                    <div className="social-name">Facebook</div>
                  </div>
                  {profileData.socialNetworks.facebook ? (
                    <div className="social-connected">Conectado</div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleConnectSocial('facebook')}
                      disabled={socialConnectStep === 'facebook'}
                    >
                      {socialConnectStep === 'facebook' ? 'Conectando...' : 'Conectar'}
                    </Button>
                  )}
                </div>
                
                <div className="social-network-item">
                  <div className="social-network-info">
                    <div className="social-icon instagram">In</div>
                    <div className="social-name">Instagram</div>
                  </div>
                  {profileData.socialNetworks.instagram ? (
                    <div className="social-connected">Conectado</div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleConnectSocial('instagram')}
                      disabled={socialConnectStep === 'instagram'}
                    >
                      {socialConnectStep === 'instagram' ? 'Conectando...' : 'Conectar'}
                    </Button>
                  )}
                </div>
                
                <div className="social-network-item">
                  <div className="social-network-info">
                    <div className="social-icon linkedin">in</div>
                    <div className="social-name">LinkedIn</div>
                  </div>
                  {profileData.socialNetworks.linkedin ? (
                    <div className="social-connected">Conectado</div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleConnectSocial('linkedin')}
                      disabled={socialConnectStep === 'linkedin'}
                    >
                      {socialConnectStep === 'linkedin' ? 'Conectando...' : 'Conectar'}
                    </Button>
                  )}
                </div>
                
                <div className="social-network-item">
                  <div className="social-network-info">
                    <div className="social-icon twitter">X</div>
                    <div className="social-name">Twitter</div>
                  </div>
                  {profileData.socialNetworks.twitter ? (
                    <div className="social-connected">Conectado</div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleConnectSocial('twitter')}
                      disabled={socialConnectStep === 'twitter'}
                    >
                      {socialConnectStep === 'twitter' ? 'Conectando...' : 'Conectar'}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="social-networks-note">
                <p>
                  <strong>Nota:</strong> Solo utilizaremos tus redes sociales para verificar tu identidad.
                  No publicaremos nada en tu nombre ni accederemos a tu información privada.
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="text" 
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar perfil'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompleteProfileForm; 