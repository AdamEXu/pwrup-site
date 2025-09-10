import { e as createComponent, r as renderTemplate, k as renderComponent, p as renderHead, o as renderSlot } from './astro/server_DEBWJpAb.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Posthog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template([`<script type="text/javascript" id="posthog-js">
  !(function(t, e) {
    var o, n, p, r;
    e.__SV ||
      ((window.posthog = e),
      (e._i = []),
      (e.init = function(i, s, a) {
        function g(t, e) {
          var o = e.split('.');
          2 == o.length && ((t = t[o[0]]), (e = o[1])),
            (t[e] = function() {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            });
        }
        ((p = t.createElement('script')).type = 'text/javascript'),
          (p.crossOrigin = 'anonymous'),
          (p.async = true),
          (p.src = s.api_host + '/static/array.js'),
          (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
        var u = e;
        void 0 !== a ? (u = e[a] = []) : (a = 'posthog');
        u.people = u.people || [];
        u.toString = function(t) {
          var e = 'posthog';
          return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
        };
        u.people.toString = function() {
          return u.toString(1) + '.people (stub)';
        };
        o =
          'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId'.split(
            ' '
          );
        for (n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a]);
      }),
      (e.__SV = 1));
  })(document, window.posthog || []);
  posthog.init('phc_11X5ZmJXzYY0Se5k5P758Mg4EHcDsrE2DCaRooBl3GZ', { api_host: 'https://us.i.posthog.com', defaults: '2025-05-24' });
<\/script>`])));
}, "/Users/adam/Developer/pwrup-site/src/components/posthog.astro", void 0);

const $$PostHogLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html> <head>${renderComponent($$result, "PostHog", $$Posthog, {})}${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/adam/Developer/pwrup-site/src/layouts/PostHogLayout.astro", void 0);

export { $$PostHogLayout as $ };
