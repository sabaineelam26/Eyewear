import React from 'react';
import './StaticPage.css';

const StaticPage = ({ title }) => {
  const renderContent = () => {
    switch (title) {
      case 'Shipping & Returns':
        return (
          <div className="static-content">
            <h2>Shipping Information</h2>
            <p>We offer free standard shipping on all orders over $100. For orders under $100, standard shipping is $15.</p>
            <ul>
              <li><strong>Standard Shipping:</strong> 3-5 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days ($25)</li>
              <li><strong>International Shipping:</strong> 7-14 business days (varies by location)</li>
            </ul>
            
            <h2>Returns & Exchanges</h2>
            <p>We want you to love your eyewear. If you're not completely satisfied, you can return or exchange your order within 30 days of receipt.</p>
            <ul>
              <li>Items must be unworn, in their original condition, and with all packaging intact.</li>
              <li>Prescription lenses are custom-made and may be subject to a restocking fee.</li>
              <li>To initiate a return, please visit our Returns Center or contact our support team.</li>
            </ul>
          </div>
        );
      case 'Frequently Asked Questions':
        return (
          <div className="static-content faq-content">
            <div className="faq-item">
              <h3>How do I know my frame size?</h3>
              <p>You can usually find your frame size on the inside of the temple arm of your current glasses. It consists of three numbers: lens width, bridge width, and temple length. Check out our Size Guide for more details.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer prescription lenses?</h3>
              <p>Yes, we offer a wide range of prescription lenses including single vision, progressives, and blue light blocking options. You can upload your prescription during checkout.</p>
            </div>
            <div className="faq-item">
              <h3>What is your warranty policy?</h3>
              <p>All our eyewear comes with a 1-year warranty against manufacturing defects. This does not cover normal wear and tear, accidental damage, or scratched lenses.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use my vision insurance?</h3>
              <p>We currently function as an out-of-network provider for most vision insurance plans. We can provide you with a detailed receipt to submit for reimbursement.</p>
            </div>
          </div>
        );
      case 'Size Guide':
        return (
          <div className="static-content">
            <h2>Understanding Frame Measurements</h2>
            <p>Eyewear measurements are typically written as three numbers (e.g., 50-20-145). These represent:</p>
            <div className="size-guide-grid">
              <div className="size-item">
                <h3>1. Lens Width (e.g., 50)</h3>
                <p>The horizontal width of each lens in millimeters. This determines how wide the frames will sit on your face.</p>
              </div>
              <div className="size-item">
                <h3>2. Bridge Width (e.g., 20)</h3>
                <p>The distance between the two lenses. A proper bridge fit is crucial for comfort and keeping your glasses from sliding down.</p>
              </div>
              <div className="size-item">
                <h3>3. Temple Length (e.g., 145)</h3>
                <p>The length of the arms, from the hinge to the tip. This ensures the glasses fit securely over your ears.</p>
              </div>
            </div>
            <h2>Fit Recommendations</h2>
            <p><strong>Narrow Faces:</strong> Look for a lens width between 42mm - 50mm.</p>
            <p><strong>Medium Faces:</strong> Look for a lens width between 48mm - 53mm.</p>
            <p><strong>Wide Faces:</strong> Look for a lens width of 52mm or larger.</p>
          </div>
        );
      case 'Terms & Conditions':
        return (
          <div className="static-content">
            <h2>1. Introduction</h2>
            <p>Welcome to EYEWEAR. By accessing or using our website, you agree to be bound by these Terms & Conditions. Please read them carefully.</p>
            
            <h2>2. Products and Pricing</h2>
            <p>All products are subject to availability. We reserve the right to modify or discontinue any product without notice. Prices are subject to change, but changes will not affect orders that have already been accepted.</p>
            
            <h2>3. Prescriptions</h2>
            <p>If you order prescription eyewear, you certify that you have a valid prescription provided by a licensed eye care professional and that the information you provide matches your prescription exactly.</p>
            
            <h2>4. Intellectual Property</h2>
            <p>All content on this site, including text, graphics, logos, and images, is the property of EYEWEAR or its content suppliers and is protected by intellectual property laws.</p>
          </div>
        );
      case 'Privacy Policy':
        return (
          <div className="static-content">
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This includes your name, email address, shipping address, and payment information.</p>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, communicate with you, and improve our services. We may also use your information to send you marketing communications if you have opted in.</p>
            
            <h2>Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with third-party service providers who help us operate our business (e.g., payment processors, shipping partners).</p>
            
            <h2>Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </div>
        );
      case 'Affiliates':
        return (
          <div className="static-content center-content">
            <h2>Join Our Affiliate Program</h2>
            <p>Partner with EYEWEAR and earn commission by referring customers to our premium collection.</p>
            <div className="benefits-list">
              <div className="benefit">
                <h3>Competitive Commission</h3>
                <p>Earn up to 15% commission on every successful referral sale.</p>
              </div>
              <div className="benefit">
                <h3>30-Day Cookie</h3>
                <p>Get credited for sales even if the customer purchases up to 30 days after clicking your link.</p>
              </div>
              <div className="benefit">
                <h3>Exclusive Assets</h3>
                <p>Access high-quality banners, images, and exclusive promotional codes.</p>
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '2rem' }}>Apply Now</button>
          </div>
        );
      default:
        return (
          <div className="static-content center-content">
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              This page is currently being updated. Please check back soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="static-page-wrapper fade-in">
      <div className="static-page-header">
        <h1>{title}</h1>
      </div>
      <div className="container">
        <div className="static-page-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
