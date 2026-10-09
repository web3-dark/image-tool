import { Link } from '../../components/LocalizedLink.jsx';

export function JobApplicationImages() {
  return <>
    <p className="lead">An application portal rejects your attachment as too large. Before shrinking anything, check whether it wants a photo, an image of a certificate, or a PDF or Word résumé. PicThin handles images in your browser. It does not compress PDFs or Word documents, and your original and processed images aren’t uploaded to PicThin.</p>
    <h2>Match the file to the upload field</h2>
    <ul>
      <li><strong>Profile photo:</strong> check the required dimensions and crop as well as the file size.</li>
      <li><strong>Certificate or portfolio image:</strong> confirm that images are accepted, then keep names, dates, and relevant detail readable.</li>
      <li><strong>Résumé:</strong> keep the requested document format. Turning a text résumé into screenshots removes its selectable text and may not meet the portal’s requirements.</li>
      <li><strong>Several attachments:</strong> check whether the limit applies to each file or to the combined total.</li>
    </ul>
    <h2>Reduce an image to the allowed size</h2>
    <ol>
      <li>Keep the original and note the accepted formats, size limit, and any minimum dimensions. These vary by portal.</li>
      <li>Open <Link to="/compress-image-to-size">the file size compressor</Link> and enter the stated limit. For example, use 500 KB only if that is what your upload field allows.</li>
      <li>Choose an accepted output format. The size-limit tool offers JPG and WebP. If PNG is required, use <Link to="/compress-png">the PNG compressor</Link> and check the output size yourself.</li>
      <li>Select the original image and inspect the result. The tool may reduce the dimensions to meet the limit, so check faces, fine print, and portfolio details.</li>
      <li>Download the copy, check its properties, and select that new file in the application portal. After changing settings, compress and download again.</li>
    </ol>
    <h2>What to do when the smaller file still fails</h2>
    <h3>The portal still says “file too large”</h3>
    <p>Check that you selected the new copy. If it is just below the limit, leave a little more room for differences in how file sizes are counted. Also check for a combined attachment limit; shrinking one image may not bring the whole submission under it.</p>
    <h3>The file type is wrong</h3>
    <p>Renaming a file does not convert it. For a WebP that needs to be JPG, follow <Link to="/blog/webp-upload-convert-jpg">our conversion guide</Link>. If the field requires a PDF, an image compressor is not the right tool for that attachment.</p>
    <h3>The image is too small or the text is blurry</h3>
    <p>Return to the original. A file size limit and a minimum pixel size are separate requirements. If you cannot meet both while keeping the content readable, prepare a better source image or check the portal’s alternative submission options. Recompressing a blurry copy cannot bring the detail back.</p>
    <h3>There is no specific file error</h3>
    <p>Check for missing required fields, an expired session, or an error elsewhere on the page. Compression cannot fix an account or service problem. When asking support for help, describe the error without posting private documents in a public thread.</p>
    <h2>Review the copy before sending it</h2>
    <p>Local processing does not hide names, contact details, or certificate numbers that are visible in the image. Submit only the material requested through the recruitment channel you have verified. You can <Link to="/blog/compress-images-without-uploading">inspect how PicThin processes files locally</Link> before choosing a private image.</p>
    <p>For scanned documents, see <Link to="/blog/compress-id-document-images">our guide to reducing ID and document images</Link>. For an application headshot, start with <Link to="/blog/registration-photo-under-200kb">the photo size checklist</Link>.</p>
  </>;
}

export function IdDocumentImages() {
  return <>
    <p className="lead">If an upload form accepts an image of your ID or a scanned document, you can make a smaller copy in your browser before submitting it. PicThin does not upload your original or processed images. The copy still needs to meet the receiving service’s requirements for format, dimensions, and legibility.</p>
    <p>This guide covers image files such as JPG and PNG. PicThin does not compress PDFs, combine document pages, retouch documents, or prepare compliant passport portraits. It cannot tell you whether a document will be accepted for a particular application.</p>
    <h2>A passport scan is different from a passport photo</h2>
    <p>A scan of a passport’s details page needs to preserve the document’s text and edges. A portrait submitted with an application can have separate rules for framing and background. Neither has a universal 200 KB limit. Read the instructions for the exact attachment on the official application website.</p>
    <ul>
      <li>Check whether it accepts images or requires PDF, and whether the size limit is per page, per file, or per submission.</li>
      <li>Look for requirements about complete edges, color, front and back, and minimum dimensions.</li>
      <li>Keep an original. If the receiving service prohibits a particular edit or compression method, follow its instructions.</li>
    </ul>
    <h2>Practice with a harmless file first</h2>
    <p><a href="/img/demo/landscape.png" download>Download the public landscape sample</a> to try selecting, processing, and saving an image. It is a workflow demo, not evidence that small document text will survive the same settings. For a closer look at what is sent over the network, follow <Link to="/blog/compress-images-without-uploading">the local-processing check</Link>.</p>
    <h2>Make a smaller document image</h2>
    <ol>
      <li>Open <Link to="/compress-image-to-size">the size-limit compressor</Link> and enter the receiving service’s limit. Do not aim far below it just to get a tiny file.</li>
      <li>Select an accepted format. JPG removes transparency. Use WebP only when the receiving service accepts it; for required PNG output, use <Link to="/compress-png">the PNG tool</Link> and inspect the resulting size.</li>
      <li>Choose an original image. PicThin adjusts quality and may reduce width and height. It does not enforce the portal’s minimum resolution.</li>
      <li>Download the result and compare it with the original at 100% zoom in an image viewer. Check names, numbers, fine print, stamps, and edges. On a passport details page, also check the machine-readable characters along the bottom.</li>
      <li>Verify the file type, size, and pixel dimensions before submitting that copy through the official portal. If important detail has become unclear, stop and return to the original.</li>
    </ol>
    <h2>Keep small text readable</h2>
    <p>Glare, blur, and a poorly framed scan should be fixed at the source. Compression cannot reconstruct missing characters. Repeatedly compressing the same copy will not improve them either.</p>
    <p>If allowed, raise the target size and start again from the original. When the file size and minimum dimensions cannot both be met, consult the receiving service’s help. Do not remove or alter document information to reduce the file size.</p>
    <h2>Understand the privacy boundary</h2>
    <p>Processing locally avoids handing your image to a compression server. Sending the finished file to an application portal is still an upload. Loading site code, visit analytics, and voluntarily sending feedback are separate activities; see <Link to="/about">how PicThin works</Link>.</p>
    <p>Compression does not redact visible information or guarantee metadata removal. Removing GPS data does not anonymize an ID with an address printed on it. For public sharing, decide what should be visible first; for an official submission, follow the recipient’s requirements.</p>
    <h2>If the portal still rejects it</h2>
    <p>Check for the wrong copy, an unsupported format, dimensions below the minimum, or a total attachment limit. Changing a PDF’s extension to .jpg will not make it an image. If the file matches the published requirements, ask the receiving service about the error. A successful compression is not approval of your application.</p>
  </>;
}
