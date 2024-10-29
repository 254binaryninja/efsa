'use client'

import React from 'react';

interface contactProps {
    contactRef?: React.RefObject<HTMLElement|null>;
}

function Contact({contactRef}:contactProps) {
    return (
        <section ref={contactRef}>

        </section>
    );
}

export default Contact;