"""new message DB

Revision ID: 89a37bf8bcd9
Revises: 0ff433ba68f9
Create Date: 2016-12-16 18:04:27.039109

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '89a37bf8bcd9'
down_revision = '0ff433ba68f9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('msgs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.Text(), nullable=True),
    sa.Column('username', sa.Text(), nullable=True),
    sa.Column('created_time', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('msgs')
    # ### end Alembic commands ###