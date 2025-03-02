import * as migration_20250104_222122_initial_collections from "./20250104_222122_initial_collections"
import * as migration_20250108_230907_club_members from "./20250108_230907_club_members"
import * as migration_20250121_010901_additional_fields from "./20250121_010901_additional_fields"
import * as migration_20250201_230502_resources from "./20250201_230502_resources"
import * as migration_20250202_202832_on_sidebar_attribute from "./20250202_202832_on_sidebar_attribute"
import * as migration_20250210_045754_question_description from "./20250210_045754_question_description"
import * as migration_20250215_015517_required_field from "./20250215_015517_required_field"
import * as migration_20250215_074406_referral_code from "./20250215_074406_referral_code"
import * as migration_20250217_065250_referral_input from "./20250217_065250_referral_input"
import * as migration_20250217_081556_answers_not_required from "./20250217_081556_answers_not_required"
import * as migration_20250302_061329_verified_registation_field from "./20250302_061329_verified_registation_field"

export const migrations = [
  {
    up: migration_20250104_222122_initial_collections.up,
    down: migration_20250104_222122_initial_collections.down,
    name: "20250104_222122_initial_collections",
  },
  {
    up: migration_20250108_230907_club_members.up,
    down: migration_20250108_230907_club_members.down,
    name: "20250108_230907_club_members",
  },
  {
    up: migration_20250121_010901_additional_fields.up,
    down: migration_20250121_010901_additional_fields.down,
    name: "20250121_010901_additional_fields",
  },
  {
    up: migration_20250201_230502_resources.up,
    down: migration_20250201_230502_resources.down,
    name: "20250201_230502_resources",
  },
  {
    up: migration_20250202_202832_on_sidebar_attribute.up,
    down: migration_20250202_202832_on_sidebar_attribute.down,
    name: "20250202_202832_on_sidebar_attribute",
  },
  {
    up: migration_20250210_045754_question_description.up,
    down: migration_20250210_045754_question_description.down,
    name: "20250210_045754_question_description",
  },
  {
    up: migration_20250215_015517_required_field.up,
    down: migration_20250215_015517_required_field.down,
    name: "20250215_015517_required_field",
  },
  {
    up: migration_20250215_074406_referral_code.up,
    down: migration_20250215_074406_referral_code.down,
    name: "20250215_074406_referral_code",
  },
  {
    up: migration_20250217_065250_referral_input.up,
    down: migration_20250217_065250_referral_input.down,
    name: "20250217_065250_referral_input",
  },
  {
    up: migration_20250217_081556_answers_not_required.up,
    down: migration_20250217_081556_answers_not_required.down,
    name: "20250217_081556_answers_not_required",
  },
  {
    up: migration_20250302_061329_verified_registation_field.up,
    down: migration_20250302_061329_verified_registation_field.down,
    name: "20250302_061329_verified_registation_field",
  },
]
