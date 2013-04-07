<h3>This is game #{{_id}}</h3>
<ul>
  {{#_embedded.player}}
    <li data-userid="{{_links.self.href}}">{{displayName}}</li>
  {{/_embedded.player}}
  {{^_embedded.player}}
    <li>No players have joined yet.</li>
  {{/_embedded.player}}
</ul>
{{#_links.join}}
<button class="btn" href="{{href}}" rel="{{rel}}">Join</button>
{{/_links.join}}
