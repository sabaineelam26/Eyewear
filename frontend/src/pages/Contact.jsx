import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import './Contact.css';

const Contact = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            addToast('Your message has been sent successfully! We will get back to you soon.', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="contact-page container fade-in">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Please fill out the form below or reach out to us using the contact details provided.</p>
            </div>
            
            <div className="contact-layout">
                <div className="contact-info">
                    <div className="info-card">
                        <h3>Our Store</h3>
                        <p>123 Eyewear Avenue<br/>New York, NY 10001<br/>United States</p>
                    </div>
                    
                    <div className="info-card">
                        <h3>Contact Details</h3>
                        <p><strong>Email:</strong> support@eyewear.com<br/><strong>Phone:</strong> +1 (555) 123-4567</p>
                    </div>
                    
                    <div className="info-card">
                        <h3>Business Hours</h3>
                        <p>Monday - Friday: 9am - 6pm EST<br/>Saturday: 10am - 4pm EST<br/>Sunday: Closed</p>
                    </div>
                </div>
                
                <div className="contact-form-container">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Send us a message</h2>
                        
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                className="form-input" 
                                required 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="John Doe"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                className="form-input" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="john@example.com"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input 
                                type="text" 
                                id="subject" 
                                name="subject" 
                                className="form-input" 
                                required 
                                value={formData.subject} 
                                onChange={handleChange} 
                                placeholder="How can we help?"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                className="form-input" 
                                required 
                                value={formData.message} 
                                onChange={handleChange} 
                                rows="5"
                                placeholder="Your message here..."
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem' }}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
