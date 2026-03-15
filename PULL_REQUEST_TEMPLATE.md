# Pull Request — Logist.kg

## Description
Briefly describe the changes made in this pull request.

Example:
- Added freight search filters
- Fixed vehicle form validation
- Improved bid creation logic

---

## Type of Change

Select one or more:

- Bug fix
- New feature
- Improvement
- Refactoring
- Documentation update
- Security fix

---

## Related Issue

If this PR is related to an issue, reference it here.

Example:


Closes #12


---

## Changes Made

List the main changes:

- change 1
- change 2
- change 3

---

## Firestore Impact

Check if this PR affects Firestore:

- [ ] No database changes
- [ ] New fields added
- [ ] New collection added
- [ ] Query modified
- [ ] Index required

If database structure changed, update:

- `DATABASE_SCHEMA.md`
- `FIRESTORE_INDEXES.md`

---

## Firebase Cost Check

Confirm the following:

- [ ] Queries use `limit()`
- [ ] Queries use `where()` filters
- [ ] Pagination is used where needed
- [ ] No large realtime listeners added
- [ ] No large arrays stored in documents

---

## Security Check

Confirm:

- [ ] Firestore rules are respected
- [ ] User roles are validated
- [ ] No open read/write access added
- [ ] Admin actions restricted properly

---

## Testing

Describe how this change was tested.

Example:

- Tested freight creation
- Tested bid creation
- Tested chat messaging

---

## Screenshots (if UI change)

Add screenshots if the UI was modified.

---

## Checklist

Before merging:

- [ ] Code reviewed
- [ ] Firestore queries optimized
- [ ] Security rules respected
- [ ] Documentation updated
- [ ] No sensitive data committed

---

## Notes

Add any extra comments for reviewers.