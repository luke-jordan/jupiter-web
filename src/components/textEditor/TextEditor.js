import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const defaultConfig = {
  service_message: '',
  menubar: false,
  toolbar: [
    'bold italic underline strikethrough | forecolor backcolor fontsizeselect | ',
    'alignleft aligncenter alignright | bullist numlist | outdent indent | link | preview'
  ].join(''),
  plugins: 'link lists preview wordcount',
  branding: false,
  min_height: 275,
  fontsize_formats: [8, 10, 12, 14, 18, 24, 36].map(v => `${v}px`).join(' ')
};

const TextEditor = props => {
  return <Editor {...props} init={{ ...defaultConfig, ...props.init }}/>;
};

export default TextEditor;