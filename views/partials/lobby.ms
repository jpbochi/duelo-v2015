<h3>This game is on <i>{{state}}</i></h3>
<ul>
  {{#_embedded.player}}
  <li data-userid="{{_links.self.href}}">
    <span>{{displayName}}</span>
    <span>{{state}}</span>
  </li>
  {{/_embedded.player}}
  {{^_embedded.player}}
    <li>No players have joined yet.</li>
  {{/_embedded.player}}
</ul>
{{#_links.join}}
<button class="btn btn-default" href="{{href}}" rel="{{rel}}">Join</button>
{{/_links.join}}
{{#_links.become-ready}}
<button class="btn btn-default" href="{{href}}" rel="{{rel}}">I'm ready</button>
{{/_links.become-ready}}
