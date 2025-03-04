# Custom Font Generation Instructions

This document explains how to generate and integrate custom fonts for the "Расписание" project. These fonts are used by jsPDF to properly render Cyrillic characters (e.g., in "Расписание"). For more project details, please refer to the [README.MD](../README.MD).

## Overview

The project uses jsPDF with the AutoTable plugin to generate PDFs. Since the default fonts in jsPDF do not support Cyrillic characters, a custom font (such as Roboto-Regular) is embedded in the PDF output. This is accomplished by converting a TTF file into a base64-encoded string and registering it with jsPDF.

## Steps to Generate a Custom Font

1. **Choose a Font**  
   Select a TrueType Font (TTF) that supports Cyrillic characters. For example, you can use [Roboto-Regular](https://fonts.google.com/specimen/Roboto).

2. **Convert the Font to Base64**  
   Use one of the following tools:
   - [jsPDF Font Converter](https://raw.githack.com/MrRio/jsPDF/master/fontconverter/fontconverter.html)  
   - [Peck Consulting Font Converter](https://peckconsulting.s3.amazonaws.com/fontconverter/fontconverter.html)

   Upload your chosen TTF file to the converter. The tool will generate a base64-encoded string containing the font data along with a proper Unicode cmap.

3. **Create the Font File**  
   Save the generated output in a new file located at: [src/client/fonts/](src/client/fonts/)

   For example, the file might look like this:
   ```html
   <script>
     var font = 'AAEAAAASAQ...AAA/';  // Your full base64-encoded font string
     const { jsPDF } = window.jspdf;
     var callAddFont = function () {
         this.addFileToVFS('Roboto-Regular-normal.ttf', font);
         this.addFont('Roboto-Regular-normal.ttf', 'Roboto-Regular', 'normal');
         console.log('Font Roboto-Regular-normal.ttf added');
     };
     jsPDF.API.events.push(['addFonts', callAddFont]);
   </script>

4. **Include the Font in the Project**  
   In your [src/client/index.html](src/client/index.html) file, include the generated font file before your main script:

    ```html
    <?!= include('client/fonts/Roboto-Regular-normal.js.html') ?>
    <?!= include('client/script.html') ?>
    ```
    This ensures that the font is added to jsPDF’s virtual file system and registered correctly.

### Usage in PDF Generation

Within your PDF generation code (in src/client/script.html), set the font like this:

```js
doc.setFont("Roboto-Regular", "normal");
```
This line ensures that jsPDF uses the custom font, so all Russian text is rendered correctly in your PDFs.

## Troubleshooting

- **Unicode cmap errors**  
  If you see an error like "No unicode cmap for font," verify that:
    
    - You used a TTF file that supports Cyrillic.
    - The font conversion tool generated a complete base64 string with a proper Unicode cmap.
    - The generated string is not truncated in your font file.

- **Font not displaying**  
  Check that the generated font file is included before your main script and that the font name passed to `setFont()` matches the name used in `addFont()`.