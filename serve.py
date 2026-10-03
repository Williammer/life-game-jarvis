"""Serve only the prototype's public assets; no repository metadata or design briefs."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse

PUBLIC = {'/', '/index.html', '/variants.html', '/day.js', '/module-model.js', '/module-ui.js', '/reference-ui.js', '/docs/reference-sources.md', '/journey.js', '/feedback.js', '/docs/ai-native-feedback-design.md', '/journey-ui.js', '/journey.css', '/modules.css', '/day.css', '/day-model.js', '/app.js', '/model.js', '/styles.css', '/README.md', '/docs/game-design-research.md', '/docs/ai-native-gamification.md'}

class PrototypeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        if unquote(urlsplit(self.path).path) not in PUBLIC:
            self.send_error(404)
            return None
        return super().send_head()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bind', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=5180)
    args = parser.parse_args()
    handler = partial(PrototypeHandler, directory=Path(__file__).parent)
    print(f'Jarvis prototype: http://{args.bind}:{args.port}/', flush=True)
    ThreadingHTTPServer((args.bind, args.port), handler).serve_forever()
