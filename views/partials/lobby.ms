<h3>This is game #{{_id}}</h3>
<ul>
  {{#players}}
    <li data-userid="{{key}}">{{displayName}}</li>
  {{/players}}
  {{^players}}
    <li>No players have joined yet.</li>
  {{/players}}
</ul>
{{#_links.join}}
<button class="btn" href="{{href}}" rel="{{rel}}">Join</button>
{{/_links.join}}
