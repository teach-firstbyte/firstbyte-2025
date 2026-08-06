# FirstByte Team Data

This directory contains structured data used across the FirstByte website.

## team.json

`team.json` contains a single list of all team members (past and present) that is used by both:
- The team showcase section on the homepage
- The full team directory page

### Data Structure

Each team member has the following structure:

```json
{
  "name": "Member Name",
  "role": "Current Role",
  "image": "/team/member-name.jpg",  // Path to image in public directory
  "bio": "A brief bio about the member...",
  "linkedin": "https://linkedin.com/in/member-name",
  "github": "https://github.com/membername",  // Optional
  "twitter": "https://twitter.com/membername", // Optional
  "years": ["2022", "2023", "2024", "2025", "2026"],  // Years active with FirstByte
  "previousRoles": ["Past Role 1", "Past Role 2"]  // Optional
}
```

### How To Update

#### Adding a new team member:

1. Add a new entry to the `allTeamMembers` array in `team.json`
2. Ensure you include at least:
   - name
   - role
   - image (add the image file to `/public/team/`)
   - years (which years they were/are active)
   - linkedin (if available)

#### When a member changes roles:

1. Update their `role` to the current role
2. Add their previous role to the `previousRoles` array

#### When a member leaves:

No need to remove them! Simply ensure their `years` array doesn't include the current year.

### Allowed Roles

`role` (and each entry in `previousRoles`) should contain a value(s) of one of the following teams. Either under the role `Member` or `Lead`. 

- President
- Vice President
- Treasurer
- Logistics Coordinator (Legacy)
- CS Curricula 
- STEM Curricula 
- Software Events 
- Software Website 
- Brand & Marketing 

If FirstByte's team structure changes, add/rename roles in this list so it stays the source of truth. Note that this is **not enforced in code** — there's no strict value checking when rendering, so a typo'd or missing role will silently show up as free text rather than causing an error. Keep new entries consistent with this list please!!!

### Filtering Logic

The components automatically filter members based on their years:
- Current executive board = members with "2026" in their years array
- Founding team = members with "2022" in their years array

This allows for automatic organization without duplicating data. 