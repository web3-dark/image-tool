import { PngLargerArticle, QualityArticle } from './CompressionTroubleshooting.jsx';
import LocalImagePrivacy from './LocalImagePrivacy.jsx';
import { useState } from 'react';
import { Link } from '../../components/LocalizedLink.jsx';
import ImageModal from '../../components/ImageModal.jsx';

function PhotoUnder200KB() {
  return <>
    <p className="lead">You have the right photo, but the form says it’s too large. If the limit is 200 KB, you need a smaller file—not necessarily a different photo. Start by checking the form’s requirements, then make a copy that fits.</p>
    <h2>Check more than the file size</h2>
    <p>A form can reject a photo for several reasons. Before you compress it, look for these three requirements:</p>
    <ul>
      <li><strong>File size:</strong> the limit in KB or MB, such as 200 KB.</li>
      <li><strong>Dimensions:</strong> the required width and height in pixels, sometimes with a specific aspect ratio.</li>
      <li><strong>Format:</strong> the file types the form accepts, such as JPG or PNG.</li>
    </ul>
    <p>For an ID or application photo, also check any rules about cropping, background color, and where the face appears. PicThin reduces file size; it doesn’t crop an ID photo or check whether it meets the form’s other rules.</p>
    <h2>Make a copy under 200 KB</h2>
    <ol>
      <li>Keep your original. Open <Link to="/compress-image-to-200kb">the 200 KB compressor</Link> and check that the size limit is set to 200.</li>
      <li>Choose an output format the form accepts. If it asks for JPG or JPEG, choose JPG.</li>
      <li>Select your photo. PicThin adjusts the quality and, if needed, reduces the dimensions to get under the limit.</li>
      <li>Compare the result with the original. Check faces and small text, then choose <strong>Download image</strong>.</li>
      <li>Check the downloaded file’s dimensions and upload that new copy to the form.</li>
    </ol>
    <p>If you change the size limit, choose <strong>Compress again</strong> to apply it. The copy you downloaded earlier won’t update automatically. Your photo stays in your browser throughout processing.</p>
    <h2>Try it with a sample</h2>
    <p>You can <a href="/img/demo/landscape.png" download>download our landscape sample</a> to see how the tool works before choosing your own photo.</p>
    <figure><img src="/img/guides/200kb-example.en.png" alt="The 200 KB tool showing the original landscape and a 147.29 KB JPG result" width="1486" height="788" loading="lazy" /><figcaption>In our Chromium test, a 1200 × 750 PNG of about 1.3 MB became a 1140 × 712 JPG of 147.29 KB. This changed both the format and dimensions. Your result will depend on the image.</figcaption></figure>
    <h2>Still getting an error?</h2>
    <h3>“File too large”</h3>
    <p>Make sure you selected the downloaded copy, not the original. If it’s close to the limit, try 190 KB to leave a little room for differences in how the form counts file size. For a lower limit, use <Link to="/compress-image-to-size">a custom size</Link>.</p>
    <h3>“Invalid dimensions” or “unsupported format”</h3>
    <p>A smaller file can still have the wrong dimensions or format. Check the actual downloaded file. If compression reduced it below the required dimensions, start with a suitable original. If the problem is WebP, follow our <Link to="/blog/webp-upload-convert-jpg">WebP-to-JPG guide</Link>.</p>
    <h3>The file fits, but the photo looks blurry</h3>
    <p>Go back to the original. Repeatedly compressing an already blurry copy won’t recover detail. Use a well-framed photo with less unnecessary background, or raise the size limit if the form allows it.</p>
  </>;
}

function TransparentPNG() {
  return <>
    <p className="lead">A logo or product cutout needs to stay transparent—but it doesn’t need to be a huge file. Keep the output as PNG, reduce the file size, and check the edges before you use the result.</p>
    <h2>Keep the background transparent</h2>
    <p>Use <Link to="/compress-png">the PNG compressor</Link> when you need another PNG. Converting to JPG would remove transparency. WebP can keep it, but only use WebP if the app or website receiving the file accepts it.</p>
    <p>There’s an important distinction here: PNG’s encoding is lossless, but a compression tool can reduce the number of colors <em>before</em> it encodes the file. That makes the file smaller by changing some of the pixels. Keeping transparency doesn’t mean the result is identical to the original.</p>
    <h2>Start with the default settings</h2>
    <ol>
      <li>Keep a copy of your original PNG, then open the compressor.</li>
      <li>Choose your file and start with the default quality of 82%.</li>
      <li>Compare the preview and file size. To make it smaller, lower the quality and choose <strong>Compress PNG</strong> again.</li>
      <li>Download the result and view it against both light and dark backgrounds.</li>
    </ol>
    <p>In this tool, quality controls how many colors are retained. It isn’t a promise to reduce the file size by the same percentage. At 100%, PicThin doesn’t reduce the color palette; the file may not get smaller.</p>
    <h2>Look closely at three areas</h2>
    <ul>
      <li><strong>Edges:</strong> check hair, rounded corners, and cutouts for halos or rough outlines.</li>
      <li><strong>Text and thin lines:</strong> make sure they remain readable at the size you’ll actually use.</li>
      <li><strong>Gradients and shadows:</strong> look for stripes or bands where colors used to blend smoothly.</li>
    </ul>
    <p>If any of these look worse, raise the quality and try again from the original. The background behind a preview is part of the page; it doesn’t necessarily belong to your image.</p>
    <h2>A sample you can compare</h2>
    <p><a href="/img/demo/landscape.png" download>Download the landscape PNG</a> to see how reducing the color palette affects fine detail. This sample is opaque, so use a transparent image of your own to check transparent edges.</p>
    <figure><img src="/img/guides/png-example.en.png" alt="PNG compression at 82% quality, reducing the landscape sample from about 1.3 MB to 462.53 KB" width="1486" height="788" loading="lazy" /><figcaption>Our Chromium test kept the sample at 1200 × 750 pixels and reduced it to 462.53 KB. This example shows changes in color and file size, not a transparency test.</figcaption></figure>
    <h2>What if the file doesn’t shrink?</h2>
    <p>It may already be well optimized or use very few colors. PicThin keeps the original when the new PNG isn’t smaller, so 0% saved isn’t necessarily an error. Don’t sacrifice useful detail just to make that number change.</p>
    <p>If you’re preparing an image for a website, <Link to="/png-to-webp">try WebP</Link> as another option. If you must deliver a transparent PNG under a strict limit, check which changes are allowed. PicThin’s <Link to="/compress-image-to-size">size-limit tool</Link> produces JPG or WebP, not PNG, so it can’t meet every transparent-PNG requirement.</p>
  </>;
}

function WebPToJPG() {
  return <>
    <p className="lead">An image can open perfectly in your browser and still be rejected by an upload form. If the file is WebP and the form only accepts JPG, convert it first. Changing the filename from <code>.webp</code> to <code>.jpg</code> won’t change the format inside.</p>
    <h2>Convert the file, then upload the new copy</h2>
    <ol>
      <li>Open <Link to="/webp-to-jpg">the WebP-to-JPG converter</Link> and select your WebP.</li>
      <li>Start with the default quality of 88%. Wait for the result, then compare it with the original.</li>
      <li>To adjust the result, move the quality slider and choose <strong>Convert to JPG</strong>.</li>
      <li>Choose <strong>Download JPG</strong>. Back on the upload form, select the downloaded JPG rather than the original WebP.</li>
    </ol>
    <p>Conversion runs in your browser. PicThin doesn’t receive the image. JPG and JPEG refer to the same format, though a particular form may have its own rules about filename extensions.</p>
    <h2>Know what changes when you convert</h2>
    <h3>Transparency becomes an opaque background</h3>
    <p>JPG doesn’t support transparency. If you’re converting a logo, sticker, or cutout, inspect the background in the result. Keep WebP—or use a compatible PNG—if the image needs to sit on different backgrounds.</p>
    <h3>The JPG might be larger</h3>
    <p>The goal here is compatibility. A JPG isn’t guaranteed to be smaller than a WebP of the same image. If the form also has a file size limit, use <Link to="/compress-image-to-size">the size-limit compressor</Link> with your original WebP and choose JPG output. That avoids running an already compressed JPG through another conversion.</p>
    <h3>Animation won’t survive</h3>
    <p>JPG is a still-image format. This converter won’t preserve an animated WebP. If motion matters, use an animation tool and a format the destination supports.</p>
    <h2>Try a sample conversion</h2>
    <p><a href="/img/demo/landscape-q75.webp" download>Download the landscape WebP</a> and try the default settings. Compare the texture in the grass and cliffs as well as the file size.</p>
    <figure><img src="/img/guides/webp-jpg-example.en.png" alt="A 93.58 KB WebP converted to an 80.42 KB JPG at 88% quality" width="1486" height="788" loading="lazy" /><figcaption>In our Chromium test, this 93.58 KB WebP became an 80.42 KB JPG. This particular file got smaller; another image may not.</figcaption></figure>
    <h2>The JPG still won’t upload</h2>
    <p>Open the downloaded JPG on your device to check that it works. Then compare its size, width, height, and aspect ratio with the form’s requirements. The right format solves only one possible cause of rejection.</p>
    <p>If the form reports a connection or sign-in problem, fix that first. More compression won’t help. For a strict photo limit, see <Link to="/blog/registration-photo-under-200kb">how to get a photo under 200 KB</Link>; for transparent graphics, use <Link to="/blog/compress-png-keep-transparency">the PNG guide</Link>.</p>
  </>;
}

function JPGSizeLimit() {
  return <>
    <p className="lead">When a website asks for an image under 1 MB, 500 KB, or 200 KB, the number refers to the file’s size—not its width or height. You can often make a JPG much smaller without changing its dimensions. For a tighter limit, you may need to reduce both quality and dimensions.</p>
    <h2>Have a firm limit? Set it directly</h2>
    <p>Open <Link to="/compress-image-to-size">the size-limit compressor</Link>, enter the maximum size, and choose JPG output. Select your original image and let the tool work. It adjusts encoding quality first, then reduces dimensions if necessary.</p>
    <p>Check the result before downloading. The important question isn’t just “Does it fit?” It’s also “Can I still read the text or recognize the detail I need?” If the tool can’t meet your target at a reasonable quality, try a larger limit or a more suitable original.</p>
    <h2>Just want a smaller photo? Start with quality</h2>
    <p>Use <Link to="/compress-jpg">the JPG compressor</Link> when you’d rather choose the tradeoff yourself. Start around 80%, compare the result, and lower the setting a little at a time. Quality is an encoder setting, not a percentage of the original file size.</p>
    <p>A busy landscape and a plain background won’t shrink by the same amount at the same setting. Judge the actual result instead of looking for a universal “best” percentage.</p>
    <h2>Choose a starting point</h2>
    <div className="overflow-x-auto my-6"><table><thead><tr><th>Your limit</th><th>Where to start</th><th>What to check</th></tr></thead><tbody>
      <tr><td>1 MB</td><td>Try a moderate quality setting, or set a 1 MB limit.</td><td>Fine texture and any text in the photo.</td></tr>
      <tr><td>500 KB</td><td>Use the limit directly if you don’t want to keep adjusting quality.</td><td>Whether the result still has enough detail at its intended display size.</td></tr>
      <tr><td>200 KB or less</td><td>Expect larger photos to need smaller dimensions too.</td><td>Minimum pixel dimensions required by the form.</td></tr>
    </tbody></table></div>
    <h2>Don’t keep compressing the compressed copy</h2>
    <p>JPG uses lossy compression: saving it again with different settings can discard more detail. Keep the original and make each new version from that file. A smaller download is useful; losing your only good copy isn’t.</p>
    <h2>Would another format help?</h2>
    <p>WebP can be worth trying if the website or app accepts it. If the form specifically requires JPG, stick with JPG. Renaming an extension doesn’t convert a file, and a smaller unsupported file still won’t upload.</p>
    <p>For transparent graphics, JPG is the wrong output because it removes transparency. See <Link to="/blog/png-webp-jpg-comparison">the format guide</Link> for alternatives.</p>
    <h2>Before you upload</h2>
    <ul>
      <li>Open the downloaded file and inspect the details that matter.</li>
      <li>Check both file size and pixel dimensions.</li>
      <li>Select the new download on the form, not your original.</li>
      <li>If the result is just under the limit but still rejected, try a slightly smaller target.</li>
    </ul>
    <p>For a walkthrough with an actual result, see <Link to="/blog/registration-photo-under-200kb">the 200 KB photo guide</Link>. PicThin processes your images on your device; you don’t need to send them to a server to make them smaller.</p>
  </>;
}

function ImageFormats() {
  const [preview, setPreview] = useState(null);
  const samples = [
    ['/img/demo/landscape.png', 'PNG', '1,334 KB'],
    ['/img/demo/landscape-q80.jpg', 'JPG, quality 80', '112 KB'],
    ['/img/demo/landscape-q75.webp', 'WebP, quality 75', '94 KB'],
    ['/img/demo/landscape-q45.avif', 'AVIF, quality 45', '54 KB'],
  ];
  return <>
    <p className="lead">The best image format is the one that keeps the detail you need and works where you’re sending it. A photo for an upload form, a transparent logo, and a website hero image have different requirements. Start with the destination, then compare file size and appearance.</p>
    <h2>A quick way to choose</h2>
    <div className="overflow-x-auto my-6"><table><thead><tr><th>What you’re making</th><th>Start with</th><th>Why</th></tr></thead><tbody>
      <tr><td>A photo for an email or upload form</td><td>JPG</td><td>Broad compatibility and a useful balance of quality and size.</td></tr>
      <tr><td>A transparent logo, screenshot, or cutout</td><td>PNG</td><td>Transparency and sharp edges, without JPG artifacts.</td></tr>
      <tr><td>Photos or graphics for a website</td><td>WebP</td><td>Worth comparing for smaller files; supports transparency too.</td></tr>
      <tr><td>Website images where you control delivery</td><td>AVIF</td><td>Can offer further savings, with a tradeoff in encoding time and compatibility.</td></tr>
      <tr><td>An editable logo or simple illustration</td><td>SVG</td><td>Vector artwork stays sharp when resized. PicThin is for raster images, not SVG editing.</td></tr>
    </tbody></table></div>
    <p>If a form specifies a format, follow that rule. File size savings won’t help if the destination can’t open the result.</p>
    <h2>Lossy and lossless, in plain English</h2>
    <p><strong>Lossless compression</strong> stores the encoded pixels without discarding information. Decode the file and you get those pixels back. <strong>Lossy compression</strong> trades some detail for a smaller file. At a suitable setting, the difference may be hard to notice; push it too far and you’ll see blur, blocks, or rough gradients.</p>
    <figure><img src="/img/lossy-vs-lossless.en.svg" alt="Lossless compression restores every encoded pixel; lossy compression simplifies details to save space" width="800" height="360" loading="lazy" /></figure>
    <p>A tool can also change the pixels before saving them in a lossless format. For example, reducing a PNG’s color palette changes the image even though the final PNG encoding is lossless. “Still a PNG” doesn’t automatically mean “unchanged.”</p>
    <h2>JPG: a practical choice for photos</h2>
    <p>JPG, also called JPEG, works well with the smooth color changes and fine textures found in photos. Lower quality settings discard more detail to reduce the file size. It doesn’t support transparency, and sharp text or line art can show distracting artifacts.</p>
    <p>Keep a high-quality original and make each compressed copy from it. Repeatedly editing and re-encoding a JPG can cause visible damage. If you’re trying to meet a limit, follow <Link to="/blog/jpg-compress-to-target-size">the JPG file size guide</Link>.</p>
    <h2>PNG: transparency and crisp graphics</h2>
    <p>PNG is useful for screenshots, logos, interface graphics, and images that need a transparent background. Its lossless encoding handles repeated patterns well. A detailed photo contains far more variation, so the same scene can be much larger as PNG than as JPG.</p>
    <p>Use <Link to="/compress-png">PNG compression</Link> when the file must remain a PNG. Check gradients and soft edges if you reduce the number of colors. For a design master that must retain every pixel, keep the original.</p>
    <h2>WebP: worth trying for the web</h2>
    <p>WebP supports both lossy and lossless compression, along with transparency. It can make a useful alternative to JPG for photos or PNG for web graphics. Compare actual files rather than assuming every WebP will be smaller.</p>
    <p>A browser being able to display WebP doesn’t mean every upload form or desktop app accepts it. For a website you control, check your audience’s browser requirements. For a form you don’t control, follow its accepted file types. If needed, <Link to="/webp-to-jpg">convert WebP to JPG</Link>.</p>
    <h2>AVIF: smaller files can take more work</h2>
    <p>AVIF can preserve useful detail at small file sizes, but encoding can take longer and support depends on the browser, app, and workflow. It’s worth testing for images you prepare once and serve many times.</p>
    <p>On a website, you can use a <code>&lt;picture&gt;</code> element to offer AVIF first, then WebP or JPG as alternatives. Don’t assume that a browser’s ability to display AVIF also means it can encode an AVIF file. PicThin only offers output formats supported by your browser.</p>
    <h2>Compare the same scene</h2>
    <p>These files show the same landscape with different formats and settings. Open each preview and look at the grass, cliffs, and sky. Quality numbers are not equivalent across formats, so this is a practical comparison—not a controlled ranking of the codecs.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
      {samples.map(([src, format, size]) => <figure key={src} className="!m-0"><button type="button" className="block w-full cursor-zoom-in rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={`Enlarge ${format} sample`} onClick={() => setPreview({ src, title: `${format} · ${size}` })}><img src={src} alt={`${format} landscape sample`} width="1200" height="750" loading="lazy" /></button><figcaption>{format} · {size}</figcaption></figure>)}
    </div>
    <h2>What about GIF?</h2>
    <p>GIF is often associated with short animations, but its limited color palette makes it a poor fit for detailed photos. Animation also needs its own workflow: converting to a still-image format won’t preserve motion. Don’t use PicThin as an animation editor.</p>
    <h2>Make the smallest file that still does the job</h2>
    <p>Choose a compatible format, keep an original, and inspect the result at the size people will actually see. For a thumbnail, a tiny file may be enough. For a document or product photo, readable text and useful detail matter more than winning a file size comparison.</p>
    <p>Ready to try it? <Link to="/">Open PicThin</Link> to compress or convert images in your browser. Your images stay on your device.</p>
    <ImageModal isOpen={!!preview} imageUrl={preview?.src} imageTitle={preview?.title} onClose={() => setPreview(null)} />
  </>;
}

const ARTICLES = {
  'compress-images-without-uploading': LocalImagePrivacy,
  'png-larger-after-compression': PngLargerArticle,
  'compress-without-losing-quality': QualityArticle,
  'registration-photo-under-200kb': PhotoUnder200KB,
  'compress-png-keep-transparency': TransparentPNG,
  'webp-upload-convert-jpg': WebPToJPG,
  'jpg-compress-to-target-size': JPGSizeLimit,
  'png-webp-jpg-comparison': ImageFormats,
};

export default function EnglishArticle({ slug }) {
  const Article = ARTICLES[slug];
  return Article ? <Article /> : null;
}
