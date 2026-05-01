import Script from "next/script";

const YANDEX_METRICA_ID = 109002374;

/**
 * Yandex Metrica — used ONLY on public pages (landing, auth, share, checkout).
 * Not loaded inside /dashboard or /admin to respect user privacy on
 * authenticated content (see PrivacySection on landing — "никаких third-party
 * аналитиков на содержимом").
 */
export function YandexMetrica() {
  return (
    <>
      <Script id="ym-counter" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRICA_ID}', 'ym');

          ym(${YANDEX_METRICA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
