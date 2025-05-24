import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactUs = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [submitStatus, setSubmitStatus] = useState(null);
    const [error, setError] = useState(null);

    // Initialize AOS animation library (simulated)
    useEffect(() => {
        // AOS.init would be called here in real implementation
        console.log('AOS initialized');
    }, []);

    // Particles configuration (simplified for demo)
    const ParticlesBackground = () => (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-2 h-2 bg-indigo-400 opacity-20 rounded-full animate-pulse" style={{top: '10%', left: '10%'}}></div>
            <div className="absolute w-1 h-1 bg-indigo-400 opacity-30 rounded-full animate-pulse" style={{top: '20%', left: '80%', animationDelay: '1s'}}></div>
            <div className="absolute w-3 h-3 bg-indigo-400 opacity-10 rounded-full animate-pulse" style={{top: '60%', left: '20%', animationDelay: '2s'}}></div>
            <div className="absolute w-2 h-2 bg-indigo-400 opacity-25 rounded-full animate-pulse" style={{top: '80%', left: '70%', animationDelay: '0.5s'}}></div>
            <div className="absolute w-1 h-1 bg-indigo-400 opacity-40 rounded-full animate-pulse" style={{top: '30%', left: '60%', animationDelay: '1.5s'}}></div>
        </div>
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('sending');
        setError(null);

        try {
            // Replace with your actual API endpoint
            const response = await axios.post(`${apiUrl}/contact-us`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.status === 'Ok') {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
                setError(response.data.msg || 'Failed to send message');
            }
        } catch (err) {
            setSubmitStatus('error');
            setError(err.response?.data?.msg || 'Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white px-8 pb-8 pt-20 relative overflow-hidden">
            {/* Particles background */}
            <ParticlesBackground />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Contact <span className="text-indigo-400">MergX</span>
                    </h1>
                    <p className="text-xl italic text-center mx-4">
                        Reach out to us for any questions, feedback, or support needs.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    {/* Form Section with animations */}
                    <div className="w-full max-w-3xl mb-12">
                        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-xl backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-6 border-b border-indigo-400 pb-4">Send Us a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-indigo-300">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-2 text-indigo-300">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block mb-2 text-indigo-300">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block mb-2 text-indigo-300">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-3 px-6 rounded-md font-bold transition-all duration-300 ${
                                        submitStatus === 'sending'
                                            ? 'bg-indigo-700 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-500'
                                    }`}
                                    disabled={submitStatus === 'sending'}
                                >
                                    {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>

                                {submitStatus === 'success' && (
                                    <div className="mt-4 p-4 bg-green-800 bg-opacity-50 rounded-md text-center">
                                        Your message has been sent successfully!
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mt-4 p-4 bg-red-800 bg-opacity-50 rounded-md text-center">
                                        {error || 'Failed to send message. Please try again.'}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Contact Info and Follow Us section - row on medium+ screens */}
                    <div className="w-full max-w-3xl">
                        <div className="flex flex-col md:flex-row md:space-x-6 space-y-8 md:space-y-0">
                            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-xl md:w-1/2 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-6 border-b border-indigo-400 pb-4">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-indigo-600 p-2 rounded-full mt-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-indigo-300">Email</h3>
                                            <p>support@mergx.com</p>
                                            <p>info@mergx.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-indigo-600 p-2 rounded-full mt-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-indigo-300">Phone</h3>
                                            <p>+91 9009084...</p>
                                            <p>+91 7024477...</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-indigo-600 p-2 rounded-full mt-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-indigo-300">Address</h3>
                                            <p>1234 </p>
                                            <p>Vijay Nagar</p>
                                            <p>Indore , India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-xl md:w-1/2 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-6 border-b border-indigo-400 pb-4">Follow Us</h2>
                                <div className="flex space-x-4">
                                    <a href="#" className="bg-indigo-600 p-3 rounded-full hover:bg-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="bg-indigo-600 p-3 rounded-full hover:bg-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="bg-indigo-600 p-3 rounded-full hover:bg-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h4.586l.707.707 3.414 3.414 3.414-3.414.707-.707h4.172c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-9.293 17.707-3.414-3.414h-2.293v-13h18v13h-8.879l-3.414 3.414z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="bg-indigo-600 p-3 rounded-full hover:bg-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="relative w-64 h-64">
                        <div className="absolute w-32 h-32 bg-indigo-500 rounded-full opacity-80 top-0 left-0 animate-pulse"></div>
                        <div className="absolute w-32 h-32 bg-orange-500 rounded-full opacity-80 top-0 right-0 animate-pulse" style={{animationDelay: "500ms"}}></div>
                        <div className="absolute w-32 h-32 bg-green-500 rounded-full opacity-80 bottom-0 left-16 animate-pulse" style={{animationDelay: "1000ms"}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;