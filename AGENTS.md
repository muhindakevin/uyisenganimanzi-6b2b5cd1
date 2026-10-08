# Architecture rules
- News URLs use a shared title-and-ID slug helper; numeric legacy URLs redirect to the canonical slug so existing shares stay valid.
- News details load through a public server function with a non-persistent publishable database client and TanStack Query, so full article text and sharing metadata exist in the initial HTML without privileged access.