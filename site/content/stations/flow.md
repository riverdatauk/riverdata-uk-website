---
layout: layouts/page.njk

sitemap:
  priority: 0.6
---

Flow stations

{% for measure in station.fmData.measures %}
  <h3>{{ measure.@id }} {{ measures[measure.@id].label }}</h3>
  <pre>
      {{ measures[measure.@id].@id }}
      {{ measures[measure.@id].datumType }}
      {{ measures[measure.@id].label }}
      {{ measures[measure.@id].latestReading }}
      {{ measures[measure.@id].latestReading.dateTime }}
      {{ measures[measure.@id].latestReading.value }}
      {{ measures[measure.@id].parameterName  }}
      {{ measures[measure.@id].period }}
      {{ measures[measure.@id].qualifier }}
      {{ measures[measure.@id].unit }}
      {{ measures[measure.@id].unitName  }}
      {{ measures[measure.@id].valueType }}
      {{ measures[measure.@id].isActive }}
  </pre>
{% else %}
  <div>This station has no measures</div>
{% endfor %}
