import React, { useState } from 'react';
import { Button } from '../ui';
import { useChatbot, TrustAction } from '../chatbot';
import './SocialConnections.css';

interface SocialConnectionsProps {
  compact?: boolean;
  onConnect?: (network: string) => void;
  initialConnections?: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    twitter: boolean;
  };
}

const SocialConnections: React.FC<SocialConnectionsProps> = ({
  compact = false,
  onConnect,
  initialConnections = {
    facebook: false,
    instagram: false,
    linkedin: false,
    twitter: false
  }
}) => {
  const { addTrustAction } = useChatbot();
  const [socialNetworks, setSocialNetworks] = useState(initialConnections);
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);

  const handleSocialNetworkConnect = (network: string) => {
    setConnectingNetwork(network);
    
    // Simulación de conexión a red social
    setTimeout(() => {
      const updatedNetworks = {
        ...socialNetworks,
        [network]: true
      };
      
      setSocialNetworks(updatedNetworks);
      setConnectingNetwork(null);
      
      // Incrementar el índice de confianza
      addTrustAction(TrustAction.COMPLETE_PROFILE, `Conectó red social: ${network}`, 1);
      
      // Notificar al componente padre si es necesario
      if (onConnect) {
        onConnect(network);
      }
      
      // Actualizar el perfil del usuario en localStorage
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Actualizar las redes sociales conectadas
          userData.socialNetworks = {
            ...(userData.socialNetworks || {}),
            ...updatedNetworks
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error updating social networks:', error);
      }
    }, 1500);
  };

  return (
    <div className={`social-connections ${compact ? 'social-connections-compact' : ''}`}>
      {!compact && (
        <div className="social-connections-header">
          <h3 className="social-connections-title">Conecta tus redes sociales</h3>
          <p className="social-connections-description">
            Conectar tus redes sociales aumenta tu Índice de Confianza
          </p>
        </div>
      )}
      
      <div className="social-networks-container">
        <div className="social-network-item">
          <div className="social-network-info">
            <div className="social-icon facebook">f</div>
            <div className="social-name">Facebook</div>
          </div>
          {socialNetworks.facebook ? (
            <div className="social-connected">Conectado</div>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSocialNetworkConnect('facebook')}
              disabled={connectingNetwork === 'facebook'}
            >
              {connectingNetwork === 'facebook' ? 'Conectando...' : 'Conectar'}
            </Button>
          )}
        </div>
        
        <div className="social-network-item">
          <div className="social-network-info">
            <div className="social-icon instagram">In</div>
            <div className="social-name">Instagram</div>
          </div>
          {socialNetworks.instagram ? (
            <div className="social-connected">Conectado</div>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSocialNetworkConnect('instagram')}
              disabled={connectingNetwork === 'instagram'}
            >
              {connectingNetwork === 'instagram' ? 'Conectando...' : 'Conectar'}
            </Button>
          )}
        </div>
        
        <div className="social-network-item">
          <div className="social-network-info">
            <div className="social-icon linkedin">in</div>
            <div className="social-name">LinkedIn</div>
          </div>
          {socialNetworks.linkedin ? (
            <div className="social-connected">Conectado</div>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSocialNetworkConnect('linkedin')}
              disabled={connectingNetwork === 'linkedin'}
            >
              {connectingNetwork === 'linkedin' ? 'Conectando...' : 'Conectar'}
            </Button>
          )}
        </div>
        
        <div className="social-network-item">
          <div className="social-network-info">
            <div className="social-icon twitter">X</div>
            <div className="social-name">Twitter</div>
          </div>
          {socialNetworks.twitter ? (
            <div className="social-connected">Conectado</div>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSocialNetworkConnect('twitter')}
              disabled={connectingNetwork === 'twitter'}
            >
              {connectingNetwork === 'twitter' ? 'Conectando...' : 'Conectar'}
            </Button>
          )}
        </div>
      </div>
      
      {!compact && (
        <div className="social-networks-note">
          <p>
            <strong>Nota:</strong> Solo utilizaremos tus redes sociales para verificar tu identidad.
            No publicaremos nada en tu nombre ni accederemos a tu información privada.
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialConnections; 