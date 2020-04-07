import Head from 'next/head';
import React, { Component } from 'react';

class H extends Component {
    constructor(props) {
        super(props);
        this.pad = props.pad;
    }

    render() {
        return (
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="A fast, free, and opensource platform for saving notes without any tracking, client or server-side. Built by Khafra." />
                <title>Bit-Pad</title>

                <link 
                    rel="stylesheet" 
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" 
                    integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" 
                    crossorigin="anonymous" 
                />
                
                {this.pad &&
                    (
                        <>
                            <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
                            <script src="https://cdn.quilljs.com/1.3.6/quill.js" />
                        </>
                    )
                }
            </Head>
        )
    }
}

export default H;