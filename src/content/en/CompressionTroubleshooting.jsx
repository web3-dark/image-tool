import { Link } from '../../components/LocalizedLink.jsx';

export function PngLargerArticle() {
  return <>
    <p className="lead">Saved a smaller-looking image and ended up with a bigger file? Check the output format first. A bigger file can store the same visible picture less efficiently; it does not necessarily contain more useful detail.</p>
    <h2>What changed between the two files?</h2>
    <ul>
      <li><strong>A JPG became a PNG.</strong> The JPG has already discarded some detail. PNG stores the decoded pixels without that kind of loss, often taking more space. It cannot bring the missing detail back.</li>
      <li><strong>A PNG was saved again.</strong> The original may already use a small palette or an efficient encoder. Saving it with a different encoder can make it larger.</li>
      <li><strong>The result barely changed.</strong> An optimized icon may have little left to remove. Zero savings can be a reasonable result.</li>
    </ul>
    <h2>Try a real pair of files</h2>
    <p>Our public landscape samples are both 1200 × 750 pixels. The PNG is 1,366,770 bytes; the JPG is 114,220 bytes. Download both and look at the texture and edges. These files use different encoding settings, so this is an example of the tradeoff, not a promised compression ratio.</p>
    <figure><img src="/img/demo/landscape-q80.jpg" width="1200" height="750" loading="lazy" alt="Landscape sample used to compare PNG and JPG file sizes" /><figcaption><a href="/img/demo/landscape.png" download>Download PNG · about 1.30 MB</a> · <a href="/img/demo/landscape-q80.jpg" download>Download JPG · about 111.54 KB</a></figcaption></figure>
    <h2>Choose the next step by what the image needs to do</h2>
    <ul>
      <li><strong>A photo for an email or form:</strong> keep JPG, or try WebP if the destination accepts it. Compare a copy in <Link to="/">the image compressor</Link>.</li>
      <li><strong>A logo, screenshot, or transparent graphic:</strong> try <Link to="/compress-png">PNG compression</Link>. Check small text and transparent edges before using the result.</li>
      <li><strong>An image for a website:</strong> <Link to="/png-to-webp">try WebP</Link> if it works with your publishing workflow.</li>
      <li><strong>A strict upload limit:</strong> use <Link to="/compress-image-to-size">a size target</Link>. That tool outputs JPG or WebP, so it will not meet a PNG-only requirement.</li>
    </ul>
    <h2>Why the PNG quality slider behaves differently</h2>
    <p>Below 100%, PicThin reduces the number of colors before encoding the PNG. A lower setting may introduce visible steps in a smooth gradient. At 100%, it skips color reduction, but the new file can still be larger. On the PNG tool page, PicThin keeps the original if the processed copy is not smaller.</p>
    <p>Always try new settings on the original. For a transparent asset, follow our <Link to="/blog/compress-png-keep-transparency">PNG transparency checklist</Link> and inspect it against both light and dark backgrounds.</p>
    <h2>Sometimes keeping the original is the right result</h2>
    <p>If exact pixels matter, or the smaller copy makes a label hard to read, keep the original. A file that already fits its destination does not need another round of compression.</p>
    <p>For the format details, see <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types">MDN’s image format guide</a>.</p>
  </>;
}

export function QualityArticle() {
  return <>
    <p className="lead">You want a smaller file, but the details still need to hold up. Start with the job the image has to do. A profile picture, a scanned document, and a transparent logo need different decisions.</p>
    <h2>“Looks the same” is different from “unchanged”</h2>
    <p>A visually acceptable copy may have different pixels. File size measures bytes, dimensions measure pixels, and quality settings control how an encoder treats detail. None of those numbers alone tells you whether a person can read the text or recognize the face.</p>
    <h2>Look at the tradeoff for yourself</h2>
    <p>These two prepared JPG crops show the same scene at different settings. Open them at full size and compare the grass and high-contrast edges. The smaller file is useful as a demonstration, not a target for every image.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
      <figure className="!m-0"><a href="/img/demo/crop-q90.jpg"><img src="/img/demo/crop-q90.jpg" width="600" height="600" loading="lazy" alt="Higher-quality JPG crop showing texture and edge detail" /></a><figcaption>Higher-quality sample · 57.85 KB. Open for a full-size view.</figcaption></figure>
      <figure className="!m-0"><a href="/img/demo/crop-q15.jpg"><img src="/img/demo/crop-q15.jpg" width="600" height="600" loading="lazy" alt="Lower-quality JPG crop for comparing lost texture and edge detail" /></a><figcaption>Lower-quality sample · 6.33 KB. Open for a full-size view.</figcaption></figure>
    </div>
    <h2>A practical workflow for photos</h2>
    <ol>
      <li>Keep an untouched original. Start with the default 80% setting in <Link to="/compress-jpg">the JPG compressor</Link>.</li>
      <li>Check the result at the size it will be displayed, then zoom in on faces, lettering, and sharp edges.</li>
      <li>If those details break up, raise the quality and make a fresh copy from the original. If the image looks fine but the file is too large, lower it a little and compare again.</li>
      <li>Check the downloaded file’s dimensions and size before sending it.</li>
    </ol>
    <p>Quality numbers are not interchangeable between formats or encoders. “80” is a starting point here, not a universal measure of image quality.</p>
    <h2>For screenshots and logos, protect the details that matter</h2>
    <p>Tiny text, fine lines, and transparent edges need special attention. PNG encoding is lossless, but PicThin’s PNG compressor first reduces colors at settings below 100%. That step changes pixels. Keep the source file when an exact pixel match is required.</p>
    <h2>When a form insists on a smaller file</h2>
    <p><Link to="/compress-image-to-size">Set a file size limit</Link> to let PicThin adjust quality and, when necessary, dimensions. Meeting a KB limit does not prove a photo meets the form’s resolution or legibility requirements. If the result is unusable, start with a better-suited original or ask whether the destination allows a larger file.</p>
    <p>A blurry copy will not recover detail when you save it as PNG or increase a quality slider. Get the original photo or screenshot if you can.</p>
    <h2>Before you download</h2>
    <ul><li>Can you read the important text and see the important details?</li><li>Are the format and dimensions right for the destination?</li><li>Have you kept an original for future exports?</li></ul>
    <p>See our <Link to="/blog/png-webp-jpg-comparison">guide to choosing an image format</Link>, with technical background in <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types">MDN’s format guide</a>.</p>
  </>;
}
