defmodule PlanIt.Trip do
  use PlanIt.Web, :model

  schema "trip" do
    field :name, :string
    field :intensity, :integer
    field :visibility, :boolean
    field :upvotes, :integer
    field :user_id, references(:user)
    field :first_card_id, references(:card)
    field :last_card_id, references(:card)

    timestamps
  end
end



