<h3>This game is on <i>{{state}}</i></h3>
<ul>
  {{#_embedded.player}}
  <li data-userid="{{_links.self.href}}">
    <span>{{displayName}}</span>
    <span>{{state}}</span>
  </li>
  {{/_embedded.player}}
  {{^_embedded.player}}
    <li>No players playing ?!</li>
  {{/_embedded.player}}
</ul>
