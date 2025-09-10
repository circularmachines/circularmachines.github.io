---
layout: default
title: "Cooperative Bluesky Curation"
---

# Cooperative Bluesky Curation

This site automatically curates interesting content shared by our cooperative members on Bluesky. Each post has been processed and analyzed for easy consumption.

## Recent Curations

{% if site.posts.size > 0 %}
<ul>
{% for post in site.posts limit:10 %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <br><small>{{ post.date | date: "%B %d, %Y" }} • {{ post.author_handle }}</small>
    <br><em>{{ post.excerpt | strip_html | truncatewords: 20 }}</em>
  </li>
{% endfor %}
</ul>
{% else %}
<p>No posts found yet. Posts should appear here once Jekyll processes them.</p>
{% endif %}

## Debug Info

- Total posts: {{ site.posts.size }}
- Site URL: {{ site.url }}
- Base URL: {{ site.baseurl }}

---

*Powered by [bsky2llm](https://github.com/circularmachines/bsky2llm) and automated curation*
