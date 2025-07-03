import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ name }) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
    <h1 style={{ color: '#591942' }}>Welcome to Ahia, {name}!</h1>
    <p>
      We're so excited to have you join our community of buyers and sellers in Enugu.
    </p>
    <p>
      You can now post ads, browse listings, and connect with others.
    </p>
    <p>
      To get started, why not post your first ad?
    </p>
    <br />
    <p>Happy trading!</p>
    <p>The Ahia Team</p>
  </div>
);

export default WelcomeEmail;
