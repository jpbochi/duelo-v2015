<h3>Games</h3>
<ul>
  {{#game}}
    <li><a href="/play/{{_links.self.href}}">{{_links.self.href}}</a></li>
  {{/game}}
  {{^game}}
    <li>No games.</li>
  {{/game}}
</ul>
