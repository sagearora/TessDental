# Database Naming Conventions

## Table Names

**All table names MUST be singular, not plural.**

### Examples

✅ **Correct:**
- `user` (not `users`)
- `clinic` (not `clinics`)
- `role` (not `roles`)
- `capability` (not `capabilities`)
- `app_user` (compound name, still singular)
- `clinic_user` (junction table, singular form)
- `role_capability` (junction table, singular form)

❌ **Incorrect:**
- `users`
- `clinics`
- `roles`
- `capabilities`

### Rationale

1. **Consistency**: Singular names are more consistent with object-oriented thinking (a table represents a single entity type)
2. **Clarity**: Singular names make it clearer that a table represents a type/class, not a collection
3. **Industry Standard**: Many modern frameworks and ORMs prefer singular table names
4. **SQL Clarity**: When querying, `SELECT * FROM user` reads more naturally than `SELECT * FROM users`

## View Names

**View names follow the same singular convention with a `_v` suffix.**

### Examples

✅ **Correct:**
- `app_user_v`
- `clinic_v`
- `clinic_user_v`
- `role_v`
- `clinic_user_effective_capabilities_v`

## Index Names

**Index names use the pattern: `idx_<table_name>_<column_name(s)>`**

### Examples

✅ **Correct:**
- `idx_user_email`
- `idx_app_user_active`
- `idx_clinic_user_clinic`
- `idx_clinic_user_active`

## Function Names

**Function names use the pattern: `fn_<descriptive_name>`**

### Examples

✅ **Correct:**
- `fn_has_capability`
- `fn_effective_capabilities`
- `fn_create_first_admin`

## Column Names

**Column names use snake_case and are descriptive.**

### Examples

✅ **Correct:**
- `user_id`
- `clinic_id`
- `created_at`
- `updated_at`
- `is_active`
- `password_hash`
- `first_name`
- `last_name`

## Foreign Key Columns

**Foreign key columns use the pattern: `{referenced_table_name}_id`**

### Examples

✅ **Correct:**
- `user_id` (references `user.id`)
- `clinic_id` (references `clinic.id`)
- `role_id` (references `role.id`)
- `clinic_user_id` (references `clinic_user.id`)

## Junction/Join Tables

**Junction tables use compound names with both entity names in singular form, separated by underscore.**

### Examples

✅ **Correct:**
- `clinic_user` (junction between `clinic` and `user`)
- `clinic_user_role` (junction between `clinic_user` and `role`)
- `role_capability` (junction between `role` and `capability`)

## Summary

| Type | Convention | Example |
|------|-----------|---------|
| Tables | Singular, snake_case | `user`, `clinic_user` |
| Views | Singular + `_v` suffix | `app_user_v`, `clinic_v` |
| Indexes | `idx_<table>_<column>` | `idx_user_email` |
| Functions | `fn_<name>` | `fn_has_capability` |
| Columns | snake_case | `user_id`, `created_at` |
| Foreign Keys | `{table}_id` | `user_id`, `clinic_id` |
| Junction Tables | `{entity1}_{entity2}` | `clinic_user`, `role_capability` |

---

**Note**: This convention applies to all database objects created in migrations. When creating new tables, always use singular names.
