<h3>This is game #{{_id}}</h3>
<ul>
  {{#players}}
    <li data-userid="{{key}}">{{displayName}}</li>
  {{/players}}
  {{^players}}
    <li>No players have joined yet. Joining a game is under development.</li>
  {{/players}}
</ul>
