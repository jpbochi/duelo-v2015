<h3>Games</h3>
<ul class="game-list">
  {{#game}}
    <li class="game-row">
      <span class="link"><a href="#{{_links.self.href}}">{{_links.self.href}}</a></span>
      <span class="state">{{state}}</span>
      <span class="createdAt">{{createdAt}}</span>
    </li>
  {{/game}}
  {{^game}}
    <li class="empty">No games.</li>
  {{/game}}
</ul>
