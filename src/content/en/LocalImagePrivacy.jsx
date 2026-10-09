import { Link } from '../../components/LocalizedLink.jsx';

export default function LocalImagePrivacy() {
  return <>
    <p className="lead">A browser can resize and encode an image without sending it to a server. That’s how PicThin works: your browser reads the file you choose, processes it on your device, and gives you a copy to download. Your original and processed images aren’t uploaded to PicThin.</p>
    <h2>Local processing still needs an app to run</h2>
    <p>When you open PicThin, your browser downloads the page and its code. It may fetch more code when you first select an image. The compression worker is served by PicThin too. Downloading that code is different from sending your photo to a server.</p>
    <p>The site also uses visit analytics and anonymous tool events. Tool events describe the action, tool, output format, image count, processing time, and error category. They do not contain image data, filenames, or previews. If you send feedback, your message, optional email, and current page are sent to the server. That’s separate from processing an image.</p>
    <h2>Inspect a test run before using a private photo</h2>
    <p>Use a harmless sample first. You can <a href="/img/demo/landscape.png" download>download our landscape PNG</a> and try it in the <Link to="/">image compressor</Link> with JPG output selected.</p>
    <ol>
      <li>Open developer tools in desktop Chrome or Edge and choose <strong>Network</strong>. Keep recording enabled, select <strong>All</strong>, and clear the existing list.</li>
      <li>Choose the sample, let it finish processing, and download the result.</li>
      <li>Review the requests made during those steps. Check their destinations, types, and what initiated them.</li>
      <li>For requests that send data, inspect the <strong>Payload</strong>. A request to <code>/api/tool-events</code>, for example, should contain a few event fields, not a file or encoded image.</li>
      <li>Review the whole recording. A missing filename alone proves very little. If extensions are adding noise, repeat the test in a separate browser profile with extensions disabled.</li>
    </ol>
    <p>A preview URL beginning with <code>blob:</code> refers to an object available to the browser. It isn’t an upload address. However, seeing a blob URL doesn’t prove that a site isn’t sending the same image somewhere else.</p>
    <h2>Try processing another image while offline</h2>
    <p>First finish one compression with the format you intend to use. This gives the browser a chance to load the necessary code. Keep the page open, then disconnect from the internet or select <strong>Offline</strong> in the Network panel.</p>
    <p>Choose the sample again, change the quality, and check that you can generate, preview, and download a new result. Restore the connection when you’re done. If a format you haven’t used fails to start offline, load it online first and repeat the test.</p>
    <p>This checks whether that operation needs a server to do the work. It is not a complete security audit, and it cannot by itself rule out a site sending data after reconnecting. Use it alongside the request inspection, rather than treating an offline test as a universal privacy guarantee.</p>
    <h2>A private workflow doesn’t make every photo safe to share</h2>
    <p>Names, faces, document numbers, and messages can still be visible in a compressed image. Compression doesn’t redact them. Files may also contain location or camera metadata. Before publishing a photo, consider making a new copy with <Link to="/remove-image-metadata">the EXIF and GPS removal tool</Link> and checking the downloaded result.</p>
    <p>Don’t assume ordinary compression strips metadata: some tools keep the original file when it’s already small enough. Local processing also cannot protect a device controlled by malicious software or an extension. Keep your original, review the copy you plan to share, and remove files you no longer need.</p>
    <h2>Pick a tool for the job</h2>
    <ul>
      <li><Link to="/compress-jpg">Compress a JPG</Link> for an everyday photo.</li>
      <li><Link to="/compress-png">Compress a PNG</Link> for a graphic that needs transparency.</li>
      <li><Link to="/compress-image-to-size">Set a file size limit</Link> for a form, then check its format and dimension requirements too.</li>
    </ul>
    <p>For a tour of the Network panel, see <a href="https://developer.chrome.com/docs/devtools/network">Chrome’s official guide</a>. You can also read <Link to="/about">how PicThin works</Link> and open the privacy notice in the footer.</p>
  </>;
}
